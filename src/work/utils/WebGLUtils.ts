//  WebGL Utilities.
//  Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
//  for book `Interactive Computer Graphics` (7th Edition).

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'

/**
 * Initialize viewport and set canvas to pure white.
 */
export function initializeCanvas(gl: WebGLRenderingContext, canvasDOM: HTMLCanvasElement): void {
  gl.viewport(0, 0, canvasDOM.width, canvasDOM.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0) // pure white
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

export function initializeBuffer(gl: WebGLRenderingContext, bufferType: number = gl.ARRAY_BUFFER): void {
  let buf = gl.createBuffer()
  gl.bindBuffer(bufferType, buf)
}

