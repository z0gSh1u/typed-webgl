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
 * Generate scaling matrix.
 */
export function scaleMat(x: number, y: number, z: number): Mat {
  return mat4(
    x, 0.0, 0.0, 0.0,
    0.0, y, 0.0, 0.0,
    0.0, 0.0, z, 0.0,
    0.0, 0.0, 0.0, 1.0
  )
}

/**
 * Load image async.
 */
export function loadImageAsync(urls: Array<string>) {
  return new Promise<HTMLImageElement[]>((resolve, reject) => {
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

/**
 * Rotate by any axis. `angle` in DEG.
 */
export function rotateByAxis(v1: Vec3, v2: Vec3, angle: number) {
  let uvw = normalize(subtract(v2, v1) as Vec3, false) as Vec3
  let u = uvw[0], v = uvw[1], w = uvw[2]
  let c = Math.cos(radians(angle)), s = Math.sin(radians(angle))
  let A = v1[0], B = v1[1], C = v1[2]
  let pow2 = (x: number) => x * x
  let a11 = pow2(u) + c * (pow2(v) + pow2(w)), a12 = u * v * (1 - c) - w * s, a13 = u * w * (1 - c) + v * s, a14 = (A * (pow2(v) + pow2(w)) - u * (B * v + C * w)) * (1 - c) + (B * w - C * v) * s
  let a21 = u * v * (1 - c) + w * s, a22 = pow2(v) + c * (pow2(u) + pow2(w)), a23 = w * v * (1 - c) - u * s, a24 = (B * (pow2(u) + pow2(w)) - v * (A * u + C * w)) * (1 - c) + (C * u - A * w) * s
  let a31 = a13 = u * w * (1 - c) - v * s, a32 = w * v * (1 - c) + u * s, a33 = pow2(w) + c * (pow2(u) + pow2(v)), a34 = (C * (pow2(u) + pow2(v)) - w * (A * u + B * v)) * (1 - c) + (A * v - B * u) * s
  return mat4(
    a11, a12, a13, a14,
    a21, a22, a23, a24,
    a31, a32, a33, a34,
    0, 0, 0, 1.0
  )
}