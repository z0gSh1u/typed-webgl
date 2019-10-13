import '../../3rd-party/MV'
import '../../3rd-party/initShaders'

import * as WebGLUtils from '../utils/WebGLUtils'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLUtils.WebGLHelper2d
let mainBuffer: WebGLBuffer

// bind code to hook `window.onload`
window.onload = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLUtils.WebGLHelper2d(canvasDOM, gl, program)
  mainBuffer = helper.createBuffer()

  // organize data
  let vertices: Array<Vec2> = [
    vec2(0, 1),
    vec2(-1, 0),
    vec2(1, 0),
    vec2(0, -1)
  ]

  // send to buffer, and convey to attribute next
  helper.vertexSettingMode(mainBuffer, "vPosition", 2)
  helper.sendDataToBuffer(flatten(vertices))


  // request shader to draw it
  helper.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

}
