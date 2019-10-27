// WebGL Helper (2d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import { normalize8bitColor } from './WebGLUtils'
import { WebGLDrawingPackage } from './WebGLDrawingPackage'
import { WebGLDrawingObject } from './WebGLDrawingObject'

export class WebGLHelper2d {

  private canvasDOM: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private program: WebGLProgram

  private globalVertexBuffer: WebGLBuffer | null
  private globalColorBuffer: WebGLBuffer | null
  private globalVertexAttribute: string | null
  private globalAttributesPerVertex: number | null
  private globalColorAttribute: string | null

  private waitingQueue: WebGLDrawingPackage

  private lastRenderTick: number
  private INTERVAL_MIN: number

  constructor(_canvasDOM: HTMLCanvasElement, _gl: WebGLRenderingContext, _program: WebGLProgram) {
    this.canvasDOM = _canvasDOM
    this.gl = _gl
    this.program = _program
    this.globalVertexBuffer = null
    this.globalColorBuffer = null
    this.globalVertexAttribute = null
    this.globalAttributesPerVertex = null
    this.globalColorAttribute = null
    this.waitingQueue = new WebGLDrawingPackage()
    this.INTERVAL_MIN = 20
    this.lastRenderTick = 0
  }

  /**
   * Set global settings. So that you don't need to pass these arguments every time you call `drawImmediately`.
   */
  public setGlobalSettings(vertexBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, vertexAttribute: string, attributePerVertex: number, colorAttribute: string) {
    this.globalVertexBuffer = vertexBuffer
    this.globalColorBuffer = colorBuffer
    this.globalVertexAttribute = vertexAttribute
    this.globalAttributesPerVertex = attributePerVertex
    this.globalColorAttribute = colorAttribute
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
   * Get attribute location in shader.
   */
  public getAttributeLocation(variableName: string): number {
    return this.gl.getAttribLocation(this.program, variableName)
  }

  /**
   * Fill attribute in shader using data in current buffer and enable it.
   */
  private _flowDataToAttribute(
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
   * Draw from array.
   */
  public drawArrays(method: number, arg1: number, arg2: number) {
    this.gl.drawArrays(method, arg1, arg2)
  }

  /**
   * Set line witdh (thickness). Might not work in Windows.
   */
  public setLineWidth(lw: number) {
    this.gl.lineWidth(lw)
  }

  /**
   * Convert a coordinate from canvas system (left-top to be O) to WebGL system (center to be O). (2d)
   */
  private _convertCoordToWebGLSystem(canvasSystemCoord: Vec2) {
    let rect = this.canvasDOM.getBoundingClientRect() // care margin and padding
    let cvsX = canvasSystemCoord[0], cvsY = canvasSystemCoord[1]
    let cvsW = this.canvasDOM.width, cvsH = this.canvasDOM.height
    let x = ((cvsX - rect.left) - cvsW / 2) / cvsW * 2
    let y = (cvsH / 2 - (cvsY - rect.top)) / cvsH * 2
    return [x, y] as Vec2
  }

  /**
   * Convert all coordinates in a Array<Vec2> to WebGL system.
   */
  public convertCoordsToWebGLSystem(canvasSystemCoords: Array<Vec2>): Array<Vec2> {
    return canvasSystemCoords.map(ele => this._convertCoordToWebGLSystem(ele))
  }

  /**
   * Change mode to color setting, flowing color data to vertex shader from colorBuffer.
   * Usually you don't need to call this if you use `drawImmediately` method.
   */
  public colorSettingMode(colorBuffer: WebGLBuffer, colorAttribute: string) {
    this.useBuffer(colorBuffer)
    this._flowDataToAttribute(colorAttribute, 4, this.gl.FLOAT)
  }

  /**
   * Change mode to vertex setting, flowing vertex data to vertex shader from vertexBuffer.
   * Usually you don't need to call this if you use `drawImmediately` method.
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
    this._flowDataToAttribute(vertexAttribute, attributePerVertex, dataType, normalize, stride, offset)
  }

  /**
   * Send and draw using vertices immediately with no need to `bufferData` manually. 
   * `arg1` and `arg2` depend on your `method`, see WebGLRenderingContext.drawArrays(). 
   * Color might be used for lining or filling according to `method`. `data` will be converted to WebGL coord system
   * and flatten then automatically. `color8bit` goes in RGB(A). If A is missing, default 1.0.
   */
  public drawImmediately(
    data: Array<Vec2>,
    method: number,
    arg1: number,
    arg2: number,
    color: Vec3 | Vec4,
    vertexBuffer: WebGLBuffer = this.globalVertexBuffer as WebGLBuffer,
    vertexAttribute: string = this.globalVertexAttribute as string,
    attributePerVertex: number = this.globalAttributesPerVertex as number,
    colorBuffer: WebGLBuffer = this.globalColorBuffer as WebGLBuffer,
    colorAttribute: string = this.globalColorAttribute as string,
    dataType: number = this.gl.FLOAT,
    bufferType: number = this.gl.ARRAY_BUFFER,
    drawMode: number = this.gl.STATIC_DRAW) {
    let globalSet = vertexBuffer && vertexAttribute && attributePerVertex && colorBuffer && colorAttribute
    if (!globalSet) {
      throw "[drawImmediately] Global setting not enough."
    }
    // send color
    let normalizedColor = normalize8bitColor(color)
    let colorToSend: Array<Vec4> = []

    for (let i = 0; i < data.length; i++) {
      colorToSend.push(normalizedColor)
    }
    this.colorSettingMode(colorBuffer, colorAttribute)
    this.sendDataToBuffer(flatten(colorToSend))
    
    // let uColorLoc = this.gl.getUniformLocation(this.program, "uColor")
    // this.gl.uniform4fv(uColorLoc, normalizedColor)

    // send vertex
    this.vertexSettingMode(vertexBuffer, vertexAttribute, attributePerVertex, dataType)
    this.sendDataToBuffer(this.convertCoordSystemAndFlatten(data), bufferType, drawMode)
    this.drawArrays(method, arg1, arg2)
  }

  /**
   * Push a `WebGLDrawingObject` to `watingQueue`. If you want to use this, make sure
   * you have already set the global settings. Call `reRender` when you want to draw
   * these buffered objects.
   */
  public drawLater(object: WebGLDrawingObject) {
    this.waitingQueue.push(object)
  }

  /**
   * Unzip `WebGLDrawingPackage` and push all objects to `waitingQueue`.
   */
  public drawPackageLater(pkg: WebGLDrawingPackage) {
    pkg.getInnerList().forEach(ele => {
      this.drawLater(ele)
    })
  }

  /**
   * Clear canvas, then draw all objects in `waitingQueue`, then clear it.
   */
  public reRender() {
    let curTick = new Date().getTime()
    if(curTick-this.lastRenderTick < this.INTERVAL_MIN){
      return
    }
    this.clearCanvas()
    this.waitingQueue.getInnerList().forEach(ele => {
      this.drawImmediately(ele.getCookedData(), ele.getMethod(), ele.getArg1(), ele.getArg2(), ele.getColor())
    })
    this.clearWaitingQueue()
    this.lastRenderTick = curTick
  }

  /**
   * Clear `waitingQueue` manually.
   */
  public clearWaitingQueue() {
    this.waitingQueue = new WebGLDrawingPackage()
  }

  /**
   * Convert to WebGL system and flatten.
   */
  public convertCoordSystemAndFlatten(data: Array<Vec2>): ArrayBuffer {
    return flatten(this.convertCoordsToWebGLSystem(data))
  }

  /**
   * Clear canvas.
   */
  public clearCanvas() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  /**
   * Mirror a point.
   */
  public getTurnedPoint(point: any, axis: number): Vec2 {
    // !!! note that there might be something not point Vec2 in data (like Oval)
    if (point.length == 2) {
      let x = 2 * axis - point[0]
      let y = point[1]
      return [x, y]
    }
    return point
  }

  /**
   * Get the point after rotating theta (DEG) to center.
   */
  public getRotatedPoint(point: Vec2, center: Vec2, theta: number): Vec2 {
    let row = this.canvasDOM.height, col = this.canvasDOM.width
    let x1 = point[0], y1 = row - point[1], x2 = center[0], y2 = row - center[1]
    let rt = radians(theta)
    let x = (x1 - x2) * Math.cos(rt) - (y1 - y2) * Math.sin(rt) + x2
    let y = (x1 - x2) * Math.sin(rt) + (y1 - y2) * Math.cos(rt) + y2
    x = x
    y = row - y
    return [x, y]
  }

  /**
   * Get the point after moving deltaX and deltaY
   */
  public getMovedPoint(point: any, delta: Vec2): Vec2 {
    // !!! same as getTurnedPoint
    if (point.length == 2) {
      let x = point[0] + delta[0]
      let y = point[1] + delta[1]
      return [x, y]
    }
    return point
  }

}