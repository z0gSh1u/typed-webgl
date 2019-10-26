// WebGL Helper (3d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import { normalize8bitColor } from '../WebGLUtils'

export class WebGLHelper3d {

  private canvasDOM: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private program: WebGLProgram

  private rect: ClientRect | DOMRect
  private cvsH: number
  private cvsW: number

  constructor(_canvasDOM: HTMLCanvasElement, _gl: WebGLRenderingContext, _program: WebGLProgram) {
    this.canvasDOM = _canvasDOM
    this.gl = _gl
    this.program = _program
    this.rect = this.canvasDOM.getBoundingClientRect()
    this.cvsW = this.canvasDOM.width
    this.cvsH = this.canvasDOM.height
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

}