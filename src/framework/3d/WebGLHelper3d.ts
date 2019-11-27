import { DrawingObject3d } from "./DrawingObject3d"
import { DrawingPackage3d } from "./DrawingPackage3d"

// WebGL Helper (3d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

export class WebGLHelper3d {

  private canvasDOM: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private programList: Array<WebGLProgram> = []

  get currentProgram() {
    return this.program
  }

  constructor(_canvasDOM: HTMLCanvasElement, _gl: WebGLRenderingContext, _programs: Array<WebGLProgram>) {
    this.canvasDOM = _canvasDOM
    this.gl = _gl
    this.programList = _programs
    this.program = _programs[0]
  }

  /**
   * Switch to another program.
   */
  public switchProgram(index: number) {
    this.program = this.programList[index]
    this.gl.useProgram(this.program)
  }

  /**
   * Create a buffer.
   */
  public createBuffer(): WebGLBuffer {
    let buf = this.gl.createBuffer() as WebGLBuffer
    return buf
  }

  /**
   * Use a buffer as current buffer for `bufferType`.
   */
  public useBuffer(buffer: WebGLBuffer, bufferType: number = this.gl.ARRAY_BUFFER) {
    this.gl.bindBuffer(bufferType, buffer)
  }

  /**
   * Send data to buffer.
   */
  public sendDataToBuffer(
    data: ArrayBuffer,
    bufferType: number = this.gl.ARRAY_BUFFER,
    drawMode: number = this.gl.STATIC_DRAW) {
    this.gl.bufferData(bufferType, data, drawMode)
  }

  /**
   * Get `attribute` location in shader.
   */
  public getAttributeLocation(variableName: string): number {
    return this.gl.getAttribLocation(this.program, variableName)
  }

  /**
   * Get `uniform` location in shader.
   */
  public getUniformLocation(variableName: string): WebGLUniformLocation | null {
    return this.gl.getUniformLocation(this.program, variableName)
  }

  /**
   * Draw from array.
   */
  public drawArrays(method: number, arg1: number, arg2: number) {
    this.gl.drawArrays(method, arg1, arg2)
  }

  /**
   * Clear canvas.
   */
  public clearCanvas() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  /**
   * Fill attribute in shader using data in current buffer and enable it.
   */
  public startFlowingDataToAttribute(
    variableName: string,
    attributePerVertex: number,
    dataType: number,
    normalize: boolean = false,
    stride: number = 0,
    offset: number = 0) {
    this.gl.vertexAttribPointer(this.getAttributeLocation(variableName), attributePerVertex, dataType, normalize, stride, offset)
    this.gl.enableVertexAttribArray(this.getAttributeLocation(variableName))
  }

  /**
   * Generate pure color texture and bind it to `gl.TEXTURE_2D`.
   */
  public bindPureColorTexture(color: Vec4) {
    let texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
      // notice it is Uint8 here, no need to normalize
      new Uint8Array([...color.map(x => Math.floor(x * 255))] as Vec3))
    this.gl.FLOAT
  }

  /**
   * Very simple to use.
   */
  public prepare(cfg: {
    attributes: {
      buffer: WebGLBuffer,
      data: ArrayBuffer,
      varName: string,
      attrPer: number,
      type: number
    }[],
    uniforms: {
      varName: string,
      data: any,
      // a little bugged with `method`
      method: '1f' | '1fv' | '1i' | '1iv' | '2fv' | '2iv' | '3fv' | '3iv' | '4fv' | '4iv'
      | 'Matrix2fv' | 'Matrix3fv' | 'Matrix4fv'
    }[]
  }) {
    let that = this
    // deal with attributes
    cfg.attributes.forEach((ele) => {
      that.useBuffer(ele.buffer)
      that.startFlowingDataToAttribute(ele.varName, ele.attrPer, ele.type)
      that.sendDataToBuffer(ele.data)
    })
    // deal with uniforms
    cfg.uniforms.forEach((ele) => {
      let toEval: string = ''
      if (ele.method.charAt(0) == 'M') {
        toEval = `that.gl.uniform${ele.method}(that.getUniformLocation('${ele.varName}'), false, [${ele.data}])`
      } else if (ele.method.charAt(ele.method.length - 1) == 'v') {
        toEval = `that.gl.uniform${ele.method}(that.getUniformLocation('${ele.varName}'), [${ele.data}])`
      } else {
        toEval = `that.gl.uniform${ele.method}(that.getUniformLocation('${ele.varName}'), ${ele.data})`
      }
      eval(toEval)
    })
  }

  /**
   * Send texture image to GPU. Subscript is using [posFrom, posTo).
   */
  public sendTextureImageToGPU(images: HTMLImageElement[], posFrom: number, posTo: number) {
    let manager: Array<WebGLTexture> = [], gl = this.gl
    for (let i = 0; i < images.length; i++) {
      let tex = gl.createTexture() as WebGLTexture
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i] as HTMLImageElement)
      gl.generateMipmap(gl.TEXTURE_2D)
      manager.push(tex)
    }
    // 检查空位
    if (posTo - posFrom != manager.length) {
      console.log(images)
      throw '[WebGLHelper3d.sendTextureImageToGPU] No enough position to store texture. Above is the images.'
    }
    for (let i = posFrom; i < posTo; i++) {

      console.log('bind: ' + i)
      console.log('using: ' + (i-posFrom))

      let cmd1 = `gl.activeTexture(gl.TEXTURE${i})`, cmd2 = `gl.bindTexture(gl.TEXTURE_2D, manager[${i - posFrom}])`
      eval(cmd1); eval(cmd2)
    }
  }

  /**
   * Analyze f?s to v?s.
   */
  public analyzeFtoV(obj: DrawingObject3d, which: 'fs' | 'fts' | 'fns'): Vec2[] | Vec3[] {
    // TODO: Can anybody make this pile of shit prettier?
    let meshVertices: any[] = []
    switch (which) {
      case 'fs':
        if (obj.objProcessor.fs.length <= 0) { throw '[WebGLHelper3d.analyzeFtoV] fs.length <= 0.' }
        obj.objProcessor.fs.forEach(face => {
          face.forEach(vOfFace => {
            let subscript = vOfFace - 1
            meshVertices.push(obj.objProcessor.vs[subscript]) // xyzxyzxyz
          })
        })
        return meshVertices as Vec3[]
      case 'fts':
        if (obj.objProcessor.fts.length <= 0) { throw '[WebGLHelper3d.analyzeFtoV] fts.length <= 0.' }
        obj.objProcessor.fts.forEach(face => {
          face.forEach(vOfFace => {
            let subscript = vOfFace - 1
            meshVertices.push(obj.objProcessor.vts[subscript]) // xyzxyzxyz
          })
        })
        return meshVertices as Vec2[]
      case 'fns':
        if (obj.objProcessor.fns.length <= 0) { throw '[WebGLHelper3d.analyzeFtoV] fns.length <= 0.' }
        obj.objProcessor.fns.forEach(face => {
          face.forEach(vOfFace => {
            let subscript = vOfFace - 1
            meshVertices.push(obj.objProcessor.vns[subscript]) // xyzxyzxyz
          })
        })
        return meshVertices as Vec3[]
    }
  }

}
