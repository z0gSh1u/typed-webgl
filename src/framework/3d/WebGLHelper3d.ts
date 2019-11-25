// WebGL Helper (3d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import { normalize8bitColor } from '../WebGLUtils'
import { DrawingObject3d } from './DrawingObject3d'
import { DrawingPackage3d } from './DrawingPackage3d'
import { PhongLightModel } from './PhongLightModel'

export class WebGLHelper3d {

  private canvasDOM: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private program: WebGLProgram

  private globalVertexBuffer: WebGLBuffer | null
  private globalVertexAttribute: string | null
  private globalTextureBuffer: WebGLBuffer | null
  private globalTextureCoordAttribute: string | null
  private globalTextureSamplerAttribute: string | null
  private globalWorldMatrixUniform: string | null
  private globalModelMatrixUniform: string | null
  private globalExtraMatrixUniform: string | null
  private globalNormalBuffer: WebGLBuffer | null
  private globalNormalAttribute: string | null

  private lighting: PhongLightModel | null
  private globalLightPosUniform: string | null
  private globalShinessUniform: string | null
  private globalAmbientProductUniform: string | null
  private globalDiffuseProductUniform: string | null
  private globalSpecularProductUniform: string | null

  private renderingLock: boolean
  private waitingQueue: Array<DrawingPackage3d>

  constructor(_canvasDOM: HTMLCanvasElement, _gl: WebGLRenderingContext, _program: WebGLProgram) {
    this.canvasDOM = _canvasDOM
    this.gl = _gl
    this.program = _program
    this.globalTextureBuffer = null
    this.globalVertexAttribute = null
    this.globalVertexBuffer = null
    this.globalTextureCoordAttribute = null
    this.globalTextureSamplerAttribute = null
    this.globalWorldMatrixUniform = null
    this.globalModelMatrixUniform = null
    this.globalExtraMatrixUniform = null
    this.globalNormalBuffer = null
    this.globalNormalAttribute = null
    this.waitingQueue = []
    this.renderingLock = false
    this.lighting = null
    this.globalLightPosUniform = null
    this.globalShinessUniform = null
    this.globalAmbientProductUniform = null
    this.globalDiffuseProductUniform = null
    this.globalSpecularProductUniform = null
  }

  /**
   * Get the lighting.
   */
  public getLighting() {
    return this.lighting
  }

  /**
   * Set the lighting.
   */
  public setLighting(l: PhongLightModel) {
    this.lighting = l
  }

  /**
   * Set some global settings so that you don't need to pass them every time you draw. 
   */
  public setGlobalSettings(
    _vBuf: WebGLBuffer,
    _vAttr: string,
    _tBuf: WebGLBuffer,
    _tCoordAttr: string,
    _tSamplerAttr: string,
    _worldMatUniform: string,
    _modelMatUniform: string,
    _extraMatUniform: string,
    _nBuf: WebGLBuffer,
    _nAttr: string,
    _lightPosUniform: string,
    _shinessUniform: string,
    _ambientProductUniform: string,
    _diffuseProductUniform: string,
    _specularProductUniform: string,
  ) {
    this.globalTextureBuffer = _tBuf
    this.globalVertexAttribute = _vAttr
    this.globalVertexBuffer = _vBuf
    this.globalTextureCoordAttribute = _tCoordAttr
    this.globalTextureSamplerAttribute = _tSamplerAttr
    this.globalWorldMatrixUniform = _worldMatUniform
    this.globalModelMatrixUniform = _modelMatUniform
    this.globalExtraMatrixUniform = _extraMatUniform
    this.globalNormalBuffer = _nBuf
    this.globalNormalAttribute = _nAttr
    this.globalLightPosUniform = _lightPosUniform
    this.globalShinessUniform = _shinessUniform
    this.globalAmbientProductUniform = _ambientProductUniform
    this.globalDiffuseProductUniform = _diffuseProductUniform
    this.globalSpecularProductUniform = _specularProductUniform
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
   * Transform current mode to `vertexSetting`.
   */
  public vertexSettingMode(
    vertexBuffer: WebGLBuffer,
    vertexAttribute: string,
    attributePerVertex: number,
    dataType: number = this.gl.FLOAT,
    normalize: boolean = false,
    stride: number = 0,
    offset: number = 0) {
    this.useBuffer(vertexBuffer)
    this.startFlowingDataToAttribute(vertexAttribute, attributePerVertex, dataType, normalize, stride, offset)
  }

  /**
   * Transform current mode to `colorSetting`.
   */
  public colorSettingMode(colorBuffer: WebGLBuffer, colorAttribute: string) {
    this.useBuffer(colorBuffer)
    this.startFlowingDataToAttribute(colorAttribute, 4, this.gl.FLOAT)
  }

  /**
   * Set uniform color variable in fragment shader. No need to transform to `colorSetting` mode.
   */
  public setUniformColor(variableName: string, color8bit: Vec3 | Vec4) {
    this.gl.uniform4f(this.getUniformLocation(variableName), ...normalize8bitColor(color8bit))
  }

  /**
   * Set uniform matrix (4d) in shader.
   */
  public setUniformMatrix4d(variableName: string, data: Mat, transpose: boolean = false) {
    this.gl.uniformMatrix4fv(this.getUniformLocation(variableName), transpose, flatten(data))
  }

  /**
   * Transform current mode to textureSetting.
   */
  public textureSettingMode(tBuf: WebGLBuffer, tAttr: string) {
    this.vertexSettingMode(tBuf, tAttr, 2, this.gl.FLOAT)
  }

  /**
   * Transform current mode to normalSetting.
   */
  public normalSettingMode(nBuf: WebGLBuffer, nAttr: string) {
    this.vertexSettingMode(nBuf, nAttr, 3, this.gl.FLOAT)
  }

  /**
   * Draw a `DrawingObject3d` without texture. (Mesh only.)
   */
  public drawImmediatelyMeshOnly(obj: DrawingObject3d, method: number, color: Vec4) {
    // 准备mesh绘制
    let meshVertices: Array<Vec3> = []
    obj.objProcessor.fs.forEach(face => {
      face.forEach(vOfFace => {
        let subscript = vOfFace - 1
        meshVertices.push(obj.objProcessor.vs[subscript]) // xyzxyzxyz
      })
    })
    // 发送三角形顶点信息
    this.vertexSettingMode(this.globalVertexBuffer as WebGLBuffer, this.globalVertexAttribute as string, 3)
    this.sendDataToBuffer(flatten(meshVertices))


    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 处理光照相关信息（发送法向量）
    this.normalSettingMode(this.globalNormalBuffer as WebGLBuffer, this.globalNormalAttribute as string)
    let normalVectors: Array<Vec3> = []
    obj.objProcessor.fns.forEach(nv => {
      nv.forEach(vOfNV => {
        let subscript = vOfNV - 1
        normalVectors.push(obj.objProcessor.vns[subscript])
      })
    })
    this.sendDataToBuffer(flatten(normalVectors))
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // 纯色纹理
    let texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
      // notice it is Uint8 here, no need to normalize
      new Uint8Array([...color.map(x => Math.floor(x * 255))] as Vec3))
    this.drawArrays(method, 0, obj.objProcessor.getEffectiveVertexCount())
  }

  /**
   * Draw a `DrawingObject3d` immediately using the specified texture. `textureIndex` starts from 0.
   */
  public drawImmediately(obj: DrawingObject3d, textureIndex: number) {

    // 处理extraMatrix
    this.setUniformMatrix4d(this.globalExtraMatrixUniform as string, obj.extraMatrix)
    // 准备mesh绘制
    let meshVertices: Array<Vec3> = []
    obj.objProcessor.fs.forEach(face => {
      face.forEach(vOfFace => {
        let subscript = vOfFace - 1
        meshVertices.push(obj.objProcessor.vs[subscript]) // xyzxyzxyz
      })
    })
    // 发送三角形顶点信息，绘制mesh
    this.vertexSettingMode(this.globalVertexBuffer as WebGLBuffer, this.globalVertexAttribute as string, 3)
    this.sendDataToBuffer(flatten(meshVertices))

    if (obj.objProcessor.fts.length != 0) {
      // 准备材质绘制
      this.textureSettingMode(this.globalTextureBuffer as WebGLBuffer, this.globalTextureCoordAttribute as string)
      // 发送材质顶点信息
      let textureVertices: Array<Vec2> = []
      obj.objProcessor.fts.forEach(face => {
        face.forEach(vOfFace => {
          let subscript = vOfFace - 1
          textureVertices.push(obj.objProcessor.vts[subscript])
        })
      })
      this.sendDataToBuffer(flatten(textureVertices))
      // 根据前端传来的材质要求，让着色器调取显存中对应的材质
      this.gl.uniform1i(this.getUniformLocation(this.globalTextureSamplerAttribute as string), textureIndex)
    } else {
      throw "[drawImmediately] Cannot find texture vertices info. Framework doesn't support this situation."
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 处理光照相关信息（发送法向量）
    this.normalSettingMode(this.globalNormalBuffer as WebGLBuffer, this.globalNormalAttribute as string)
    let normalVectors: Array<Vec3> = []
    obj.objProcessor.fns.forEach(nv => {
      nv.forEach(vOfNV => {
        let subscript = vOfNV - 1
        normalVectors.push(obj.objProcessor.vns[subscript])
      })
    })
    this.sendDataToBuffer(flatten(normalVectors))
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // 综合绘制
    this.drawArrays(this.gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())
  }

  /**
   * Same as it says.
   */
  public setUniformVector4d(variableName: string, v: Vec4) {
    this.gl.uniform4f(this.gl.getUniformLocation(this.program, variableName), ...v)
  }

  /**
   * Re-send all lighting parameters to shader.
   * You should call it always manually.
   */
  public updateLighting(posOnly: boolean = false) {
    this.setUniformVector4d(this.globalLightPosUniform as string, [...(this.lighting as PhongLightModel).lightPosition, 1.0] as Vec4)
    if (posOnly) {
      return
    }
    this.setUniformVector4d(this.globalAmbientProductUniform as string, (this.lighting as PhongLightModel).ambientProduct)
    this.setUniformVector4d(this.globalDiffuseProductUniform as string, (this.lighting as PhongLightModel).diffuseProduct)
    this.setUniformVector4d(this.globalSpecularProductUniform as string, (this.lighting as PhongLightModel).specularProduct)
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, this.globalShinessUniform as string), (this.lighting as PhongLightModel).materialShiness)
  }

  /**
   * Draw a `DrawingPackage3d` immediately using the specified texture.
   */
  public drawPackageImmediatelyMeshOnly(pkg: DrawingPackage3d) {
    // 设置该物体的自身视图矩阵
    this.setUniformMatrix4d(this.globalModelMatrixUniform as string, pkg.modelMat)
    pkg.innerList.forEach(ele => {
      this.drawImmediatelyMeshOnly(ele, pkg.methodMeshOnly as number, pkg.colorMeshOnly as Vec4)
    })
  }

  /**
   * Draw a `DrawingPackage3d` immediately using the specified texture.
   */
  public drawPackageImmediately(pkg: DrawingPackage3d) {
    // 设置该物体的自身视图矩阵
    this.setUniformMatrix4d(this.globalModelMatrixUniform as string, pkg.modelMat)
    pkg.innerList.forEach(ele => {
      this.drawImmediately(ele, ele.textureIndex as number)
    })
  }

  /**
   * Push a `DrawingPackage3d` into `waitingQueue`.
   */
  public drawPackageLater(toDraw: DrawingPackage3d) {
    this.waitingQueue.push(toDraw)
  }

  /**
   * Clear `waitingQueue`.
   */
  public clearWaitingQueue() {
    this.waitingQueue = []
  }

  /**
   * Re-render the canvas using `waitingQueue`. Need the `ctm`.
   */
  public reRender(ctm: Mat) {
    if (this.renderingLock) {
      return
    }
    this.renderingLock = true
    this.setUniformMatrix4d(this.globalWorldMatrixUniform as string, ctm)
    // comment `clearCanvas` so that the image no longer flikers
    // this.clearCanvas()
    this.waitingQueue.forEach(ele => {
      if (!ele.meshOnly) {
        this.drawPackageImmediately(ele)
      } else {
        this.drawPackageImmediatelyMeshOnly(ele)
      }
    })
    this.clearWaitingQueue()
    this.renderingLock = false
  }

}