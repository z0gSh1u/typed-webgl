import '../../3rd-party/MV'
import '../../3rd-party/initShaders'

import { WebGLHelper2d } from '../utils/WebGLHelper2d'
import * as WebGLUtils from '../utils/WebGLUtils'
import { generateBezierCurve2dL3 } from '../utils/BezierCurve'
import { generateStraightLineSegment, generateOval } from '../utils/BasicShape'
import { WebGLDrawingObject } from '../utils/WebGLDrawingObject'
import { WebGLDrawingPackage } from '../utils/WebGLDrawingPackage'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper2d
let vBuffer: WebGLBuffer, cBuffer: WebGLBuffer

// used colors
let COLORS: { [key: string]: Vec3 } = {
  GRAY: [225, 225, 226],
  BLACK: [0, 0, 0],
  DARK: [80, 80, 80],
  LIGHTGRAY: [110, 110, 110],
  SKIN: [244, 237, 237],
  WHITE: [255, 255, 255]
}

// main function
let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper2d(canvasDOM, gl, program)
  vBuffer = helper.createBuffer(); cBuffer = helper.createBuffer()
  helper.setGlobalSettings(vBuffer, cBuffer, "aPosition", 2, "aColor")
  gl.enable(gl.DEPTH_TEST)

  // render
  render()

}

// packages (components) used in render function
// render function
let render = () => {

  // organize and draw

  // 右耳
  let ear_right = new WebGLDrawingPackage(
    new WebGLDrawingObject("右瓣", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("右瓣勾线", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("左瓣勾线", [[375, 85], [443, 39]], null, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("中部", [[425, 151], [375, 85], [443, 39]], null, gl.TRIANGLE_FAN, COLORS.GRAY),
  )
  helper.drawPackageLater(ear_right)

  // 左耳
  let ear_left = new WebGLDrawingPackage(
    new WebGLDrawingObject("左瓣", [[128, 44], [128, 72], [151, 144], [168, 151]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("左瓣勾线", [[128, 44], [128, 72], [151, 144], [168, 151]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("右瓣勾线", [[224, 75], [128, 44]], null, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("右瓣", [[166, 151], [224, 75], [128, 44]], null, gl.TRIANGLES, COLORS.GRAY),
  )
  helper.drawPackageLater(ear_left)

  // 左呆毛
  let cute_left = new WebGLDrawingPackage(
    new WebGLDrawingObject("左瓣", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("左瓣勾线", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("右瓣勾线", [[247, 41], [332, 72]], null, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("右瓣", [[300, 84], [247, 41], [332, 72]], null, gl.TRIANGLES, COLORS.GRAY),
  )
  helper.drawPackageLater(cute_left)

  // 右呆毛
  let cute_right = new WebGLDrawingPackage(
    new WebGLDrawingObject("右瓣", [[332, 34.5], [311, 30], [388, 30], [359, 82]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("右瓣勾线", [[332, 34.5], [311, 30], [388, 30], [359, 82]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("左瓣勾线", [[331, 73], [332, 34.5]], null, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("左瓣", [[361, 82], [331, 73], [332, 34.5]], null, gl.TRIANGLES, COLORS.GRAY),
  )
  helper.drawPackageLater(cute_right)

  // 左尖毛
  let sharp_left = new WebGLDrawingPackage(
    new WebGLDrawingObject("下瓣", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("下瓣勾线", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("上瓣勾线", [[184, 136.3], [132.5, 188]], null, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("上瓣", [[184, 179], [184, 136.3], [132.5, 188]], null, gl.TRIANGLES, COLORS.GRAY),
  )
  helper.drawPackageLater(sharp_left)

  // 中央刘海
  let liusea = new WebGLDrawingPackage(
    new WebGLDrawingObject("左瓣", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("左瓣勾线", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("右瓣", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY),
    new WebGLDrawingObject("右瓣勾线", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
    new WebGLDrawingObject("中部", [[330.3, 204], [271.33, 129], [365.5, 130]], null, gl.TRIANGLES, COLORS.GRAY),
  )
  helper.drawPackageLater(liusea)

  // 嘴巴
  let mouth = new WebGLDrawingPackage(
    new WebGLDrawingObject("线", [[277.3, 257.6], [264.6, 244.6], [298.3, 293], [331, 264.6]], generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK),
  )
  helper.drawPackageLater(mouth)

  // 左眼（正视）

  helper.reRender()

}

let listenKeyboard = () => {

  // A, D, Space
  // 右腿绕轴转动测试
  let leg_right_1 = [[340, 454], [303, 462], [358, 498], [315, 506], [308, 596]] as Array<Vec2>
  let leg_right_2 = [[358, 498], [308, 596], [364, 595]] as Array<Vec2>

  // 旋转15度测试
  let rotateMat = mat2(
    Math.cos(radians(15)), -Math.sin(radians(15)),
    Math.sin(radians(15)), Math.cos(radians(15))
  )
  let newFR1 = leg_right_1.map(vec => mult(rotateMat, vec)) as Array<Vec2>
  helper.drawImmediately(newFR1, gl.TRIANGLE_STRIP, 0, newFR1.length, COLORS.SKIN)
  let newFR2 = leg_right_2.map(vec => mult(rotateMat, vec)) as Array<Vec2>
  helper.drawImmediately(newFR1, gl.TRIANGLES, 0, newFR1.length, COLORS.SKIN)

}

main()
// listenKeyboard()