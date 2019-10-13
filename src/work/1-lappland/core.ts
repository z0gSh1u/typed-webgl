import '../../3rd-party/MV'
import '../../3rd-party/initShaders'

import * as WebGLUtils from '../utils/WebGLUtils'
import '../utils/BezierCurve'
import { generateBezierCurve2dL3 } from '../utils/BezierCurve'
import { generateStraightLineSegment } from '../utils/BasicShape'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLUtils.WebGLHelper2d
let vBuffer: WebGLBuffer, cBuffer: WebGLBuffer

let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLUtils.WebGLHelper2d(canvasDOM, gl, program)
  vBuffer = helper.createBuffer(); cBuffer = helper.createBuffer()
  // helper.setLineWidth(5) // !!! won't work in Windows

  // organize component data
  let COLORS: { [key: string]: Vec3 } = {
    GRAY: [225, 225, 226],
    BLACK: [0, 0, 0],
    DARK: [53, 53, 53],
    SKIN: [249, 242, 242]
  }

  // organize and draw
  // 右耳
  let ear_right_1 = generateBezierCurve2dL3([441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152])
  helper.drawImmediately(ear_right_1, gl.LINE_STRIP, 0, ear_right_1.length, COLORS.BLACK, vBuffer, 'aPosition', 2, cBuffer, 'aColor')
  helper.drawImmediately(ear_right_1, gl.TRIANGLE_FAN, 0, ear_right_1.length, COLORS.GRAY, vBuffer, 'aPosition', 2, cBuffer, 'aColor')
  // let ear_right_2 = generateStraightLineSegment([375, 85], [442, 43])
  // helper.drawImmediately(helper.convertCoordSystemAndFlatten(ear_right_2), gl.LINE_STRIP, 0, ear_right_2.length)
  let ear_filling_1 = [[375, 85], [425, 151], [443, 39]] as Array<Vec2>
  let ear_right_2 = [[375, 85], [443, 39]] as Array<Vec2>
  helper.drawImmediately(ear_right_2, gl.LINE_STRIP, 0, ear_right_2.length, COLORS.BLACK, vBuffer, 'aPosition', 2, cBuffer, 'aColor')
  helper.drawImmediately(ear_filling_1, gl.TRIANGLES, 0, ear_filling_1.length, COLORS.GRAY, vBuffer, 'aPosition', 2, cBuffer, 'aColor')

}

main()