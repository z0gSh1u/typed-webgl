// WebGL Utilities.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import '../3rd-party/MV'
import '../3rd-party/initShaders'

/**
 * Initialize viewport and set canvas to pure white.
 */
export function initializeCanvas(gl: WebGLRenderingContext, canvasDOM: HTMLCanvasElement, bgcRGBA: Vec4 = [1.0, 1.0, 1.0, 1.0]): void {
  gl.viewport(0, 0, canvasDOM.width, canvasDOM.height)
  gl.clearColor(...bgcRGBA) // pure white
  gl.clear(gl.COLOR_BUFFER_BIT)
}

/**
 * Initialize two shaders and returns the WebGLProgram.
 */
export function initializeShaders(gl: WebGLRenderingContext, vShaderPath: string, fShaderPath: string): WebGLProgram {
  let program = initShaders(gl, vShaderPath, fShaderPath) as WebGLProgram
  gl.useProgram(program)
  return program
}

/**
 * Normalize 8-bit color (RGB / RGBA) to [0, 1]. If A is missing, use 1.0.
 */
export function normalize8bitColor(color8bit: Vec3 | Vec4): Vec4 {
  return [...color8bit.map(x => x / 255), 1.0].slice(0, 4) as Vec4
}

/**
 * Get the distance between two points (2d).
 */
export function getDistance2d(pointA: Vec2, pointB: Vec2): number {
  let dX2 = Math.pow(pointA[0] - pointB[0], 2)
  let dY2 = Math.pow(pointA[1] - pointB[1], 2)
  return Math.sqrt(dX2 + dY2)
}

/**
 * Convert RAD to DEG.
 */
export function radToDeg(angle: number): number {
  return angle * 57.32
}

/**
 * Load image async.
 */
export function loadImageAsync(urls: Array<string>) {
  return new Promise((resolve, reject) => {
    let newImages: Array<HTMLImageElement> = [], loadedImagesCount = 0,
      arr = (typeof urls != "object") ? [urls] : urls
    function cb() {
      loadedImagesCount++
      if (loadedImagesCount == arr.length) {
        resolve(newImages)
      }
    }
    for (let i = 0; i < arr.length; i++) {
      newImages[i] = new Image()
      newImages[i].src = arr[i]
      newImages[i].onload = () => { cb() }
      newImages[i].onerror = () => { reject() }
    }
  })
}