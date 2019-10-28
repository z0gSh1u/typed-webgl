// WebGL Helper (3d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import { normalize8bitColor } from '../WebGLUtils'
import { DrawingObject3d } from './DrawingObject3d'
import { DrawingPackage3d } from './DrawingPackage3d'

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
    this.waitingQueue = []
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
    _modelMatUniform: string) {
    this.globalTextureBuffer = _tBuf
    this.globalVertexAttribute = _vAttr
    this.globalVertexBuffer = _vBuf
    this.globalTextureCoordAttribute = _tCoordAttr
    this.globalTextureSamplerAttribute = _tSamplerAttr
    this.globalWorldMatrixUniform = _worldMatUniform
    this.globalModelMatrixUniform = _modelMatUniform
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
   * Draw a `DrawingObject3d` immediately using the specified texture. `textureIndex` starts from 0.
   */
  public drawImmediately(obj: DrawingObject3d, textureIndex: number) {
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
    // 综合绘制
    this.drawArrays(this.gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())
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
   * Re-render the canvas using `waitingQueue`. Need new `ctm` and `modelMat`.
   */
  public reRender(ctm: Mat) {
    this.setUniformMatrix4d(this.globalWorldMatrixUniform as string, ctm)
    this.clearCanvas()
    this.waitingQueue.forEach(ele => {
      this.drawPackageImmediately(ele)
    })
    this.clearWaitingQueue()
  }

}