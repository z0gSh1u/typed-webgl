import '../../3rd-party/MV'
import '../../3rd-party/initShaders'

import { WebGLHelper2d } from '../utils/WebGLHelper2d'
import * as WebGLUtils from '../utils/WebGLUtils'
import { generateBezierCurve2dL3 } from '../utils/BezierCurve'
import { generateStraightLineSegment, generateOval } from '../utils/BasicShape'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper2d
let vBuffer: WebGLBuffer, cBuffer: WebGLBuffer

let COLORS: { [key: string]: Vec3 } = {
  GRAY: [225, 225, 226],
  BLACK: [0, 0, 0],
  DARK: [80, 80, 80],
  LIGHTGRAY: [110, 110, 110],
  SKIN: [244, 237, 237],
  WHITE: [255, 255, 255]
}

let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper2d(canvasDOM, gl, program)
  vBuffer = helper.createBuffer(); cBuffer = helper.createBuffer()
  helper.setGlobalSettings(vBuffer, cBuffer, "aPosition", 2, "aColor")
  // helper.setLineWidth(5) // !!! won't work in Windows
  gl.enable(gl.DEPTH_TEST)

  // render
  render()
}

let render = () => {
  // organize and draw

  // 右耳
  let ear_right_1 = generateBezierCurve2dL3([441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]) // 右边弧线
  helper.drawImmediately(ear_right_1, gl.LINE_STRIP, 0, ear_right_1.length, COLORS.BLACK)
  helper.drawImmediately(ear_right_1, gl.TRIANGLE_FAN, 0, ear_right_1.length, COLORS.GRAY)
  let ear_right_2 = [[375, 85], [443, 39]] as Array<Vec2> // 左边勾线
  let ear_right_3 = [[425, 151], ...ear_right_2] as Array<Vec2> // 中部填充
  helper.drawImmediately(ear_right_2, gl.LINE_STRIP, 0, ear_right_2.length, COLORS.BLACK)
  helper.drawImmediately(ear_right_3, gl.TRIANGLES, 0, ear_right_3.length, COLORS.GRAY)

  // 左耳
  let ear_left_1 = generateBezierCurve2dL3([128, 44], [128, 72], [151, 144], [168, 151])
  helper.drawImmediately(ear_left_1, gl.LINE_STRIP, 0, ear_left_1.length, COLORS.BLACK)
  helper.drawImmediately(ear_left_1, gl.TRIANGLE_FAN, 0, ear_left_1.length, COLORS.GRAY)
  let ear_left_2 = [[224, 75], [128, 44]] as Array<Vec2>
  let ear_left_3 = [[166, 151], ...ear_left_2] as Array<Vec2>
  helper.drawImmediately(ear_left_2, gl.LINE_STRIP, 0, ear_left_2.length, COLORS.BLACK)
  helper.drawImmediately(ear_left_3, gl.TRIANGLES, 0, ear_left_3.length, COLORS.GRAY)

  // 左呆毛
  let cute_left_1 = generateBezierCurve2dL3([247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84])
  helper.drawImmediately(cute_left_1, gl.LINE_STRIP, 0, cute_left_1.length, COLORS.BLACK)
  helper.drawImmediately(cute_left_1, gl.TRIANGLE_FAN, 0, cute_left_1.length, COLORS.GRAY)
  let cute_left_2 = [[247, 41], [332, 72]] as Array<Vec2>
  let cute_left_3 = [[300, 84], ...cute_left_2] as Array<Vec2>
  helper.drawImmediately(cute_left_2, gl.LINE_STRIP, 0, cute_left_2.length, COLORS.BLACK)
  helper.drawImmediately(cute_left_3, gl.TRIANGLES, 0, cute_left_3.length, COLORS.GRAY)

  // 右呆毛
  let cute_right_1 = generateBezierCurve2dL3([332, 34.5], [311, 30], [388, 30], [359, 82])
  helper.drawImmediately(cute_right_1, gl.LINE_STRIP, 0, cute_right_1.length, COLORS.BLACK)
  helper.drawImmediately(cute_right_1, gl.TRIANGLE_FAN, 0, cute_right_1.length, COLORS.GRAY)
  let cute_right_2 = [[331, 73], [332, 34.5]] as Array<Vec2>
  let cute_right_3 = [[361, 82], ...cute_right_2] as Array<Vec2>
  helper.drawImmediately(cute_right_2, gl.LINE_STRIP, 0, cute_right_2.length, COLORS.BLACK)
  helper.drawImmediately(cute_right_3, gl.TRIANGLES, 0, cute_right_3.length, COLORS.GRAY)

  // 左尖毛
  let sharp_left_1 = generateBezierCurve2dL3([132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179])
  helper.drawImmediately(sharp_left_1, gl.LINE_STRIP, 0, sharp_left_1.length, COLORS.BLACK)
  helper.drawImmediately(sharp_left_1, gl.TRIANGLE_FAN, 0, sharp_left_1.length, COLORS.GRAY)
  let sharp_left_2 = [[184, 136.3], [132.5, 188]] as Array<Vec2>
  let sharp_left_3 = [[184, 179], ...sharp_left_2] as Array<Vec2>
  helper.drawImmediately(sharp_left_2, gl.LINE_STRIP, 0, sharp_left_2.length, COLORS.BLACK)
  helper.drawImmediately(sharp_left_3, gl.TRIANGLES, 0, sharp_left_3.length, COLORS.GRAY)

  // 中央刘海
  let liusea_1 = generateBezierCurve2dL3([271.33, 129], [271.6, 165], [290.6, 204], [333, 202])
  helper.drawImmediately(liusea_1, gl.LINE_STRIP, 0, liusea_1.length, COLORS.BLACK)
  helper.drawImmediately(liusea_1, gl.TRIANGLE_FAN, 0, liusea_1.length, COLORS.GRAY)
  let liusea_2 = generateBezierCurve2dL3([365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204])
  helper.drawImmediately(liusea_2, gl.LINE_STRIP, 0, liusea_2.length, COLORS.BLACK)
  helper.drawImmediately(liusea_2, gl.TRIANGLE_FAN, 0, liusea_2.length, COLORS.GRAY)
  let liusea_3 = [[330.3, 204], [271.33, 129], [365.5, 130]] as Array<Vec2>
  helper.drawImmediately(liusea_3, gl.TRIANGLES, 0, liusea_3.length, COLORS.GRAY)

  // 嘴巴
  let mouth_1 = generateBezierCurve2dL3([277.3, 257.6], [264.6, 244.6], [298.3, 293], [331, 264.6])
  helper.drawImmediately(mouth_1, gl.LINE_STRIP, 0, mouth_1.length, COLORS.BLACK)

  // 左眼（正视）
  let eye_left_3 = generateStraightLineSegment([271.5, 225.3], [272, 240.3])
  helper.drawImmediately(eye_left_3, gl.LINE_STRIP, 0, eye_left_3.length, COLORS.BLACK)
  let eye_left_1 = generateBezierCurve2dL3([233, 236], [248, 209.33], [287, 193], [294.6, 238])
  helper.drawImmediately(eye_left_1, gl.LINE_STRIP, 0, eye_left_1.length, COLORS.BLACK)
  helper.drawImmediately(eye_left_1, gl.TRIANGLE_FAN, 0, eye_left_1.length, COLORS.WHITE)
  let eye_left_2 = generateBezierCurve2dL3([233, 236], [218, 231], [289.6, 254], [294.6, 235.6])
  helper.drawImmediately(eye_left_2, gl.LINE_STRIP, 0, eye_left_2.length, COLORS.BLACK)
  helper.drawImmediately(eye_left_2, gl.TRIANGLE_FAN, 0, eye_left_2.length, COLORS.WHITE)

  // 右眼（正视）
  let eye_right_3 = generateStraightLineSegment([347.5, 223], [348, 237])
  helper.drawImmediately(eye_right_3, gl.LINE_STRIP, 0, eye_right_3.length, COLORS.BLACK)
  let eye_right_1 = generateBezierCurve2dL3([330, 229], [335.3, 209.6], [355.3, 195], [368, 228])
  helper.drawImmediately(eye_right_1, gl.LINE_STRIP, 0, eye_right_1.length, COLORS.BLACK)
  helper.drawImmediately(eye_right_1, gl.TRIANGLE_FAN, 0, eye_right_1.length, COLORS.WHITE)
  let eye_right_2 = generateBezierCurve2dL3([331, 229], [318, 229], [350, 250], [368, 226.6])
  helper.drawImmediately(eye_right_2, gl.LINE_STRIP, 0, eye_right_2.length, COLORS.BLACK)
  helper.drawImmediately(eye_right_2, gl.TRIANGLE_FAN, 0, eye_right_2.length, COLORS.WHITE)

  // 左臂（正视）
  let arm_left_1 = generateBezierCurve2dL3([223, 308.5], [209, 331.5], [263.5, 242], [272, 319])
  helper.drawImmediately(arm_left_1, gl.TRIANGLE_FAN, 0, arm_left_1.length, COLORS.LIGHTGRAY)
  let arm_left_2 = [[162, 395], [225, 306], [247, 429], [270, 315]] as Array<Vec2>
  helper.drawImmediately(arm_left_2, gl.TRIANGLE_STRIP, 0, arm_left_2.length, COLORS.LIGHTGRAY)

  // 左手（正视）
  let hand_left_1 = generateBezierCurve2dL3([174.6, 404.3], [142.6, 442.6], [162.6, 531.6], [220.6, 456])
  helper.drawImmediately(hand_left_1, gl.TRIANGLE_FAN, 0, hand_left_1.length, COLORS.SKIN)
  let hand_left_2 = generateBezierCurve2dL3([220.6, 456], [225.6, 469.3], [236.3, 473.3], [236.6, 431.3])
  helper.drawImmediately(hand_left_2, gl.TRIANGLE_FAN, 0, hand_left_2.length, COLORS.SKIN)
  let hand_left_3 = [[174.6, 404.3], [220, 459.6], [237, 431.3]] as Array<Vec2>
  helper.drawImmediately(hand_left_3, gl.TRIANGLES, 0, hand_left_3.length, COLORS.SKIN)

  // 衣服左（正视）
  let cloth_left_1 = [[210, 271], [295, 358], [298, 289], [210, 271], [295, 358], [144, 468], [144, 468], [295, 358], [273, 497]] as Array<Vec2>
  helper.drawImmediately(cloth_left_1, gl.TRIANGLE_STRIP, 0, cloth_left_1.length, COLORS.DARK)
  // 没有勾线，颜色太深，勾了也看不出来

  // 衣服右（正视）
  let cloth_right_1 = [[277, 330], [346, 275], [319, 388], [347, 370], [391, 488]] as Array<Vec2>
  helper.drawImmediately(cloth_right_1, gl.TRIANGLE_STRIP, 0, cloth_right_1.length, COLORS.DARK)

  // 脸
  let face_1 = generateOval([304, 220], 170 / 2, 168 / 2)
  helper.drawImmediately(face_1, gl.TRIANGLE_FAN, 0, face_1.length, COLORS.SKIN)
  helper.drawImmediately(face_1, gl.LINE_STRIP, 0, face_1.length, COLORS.BLACK)

  // 头部实体
  let head_1 = generateOval([290, 180], 274 / 2, 235 / 2)
  helper.drawImmediately(head_1, gl.TRIANGLE_FAN, 0, head_1.length, COLORS.GRAY)
  helper.drawImmediately(head_1, gl.LINE_STRIP, 0, head_1.length, COLORS.BLACK)

  // 右臂（正视）
  let arm_right_1 = [[347, 361], [390, 401], [365, 417]] as Array<Vec2>
  helper.drawImmediately(arm_right_1, gl.TRIANGLES, 0, arm_right_1.length, COLORS.LIGHTGRAY)

  // 右手（正视）
  let hand_right_3 = generateBezierCurve2dL3([393.3, 443.3], [383.3, 435], [426.3, 463], [380.3, 409.6])
  helper.drawImmediately(hand_right_3, gl.TRIANGLE_FAN, 0, hand_right_3.length, COLORS.SKIN)
  let hand_right_4 = [[376, 444], [367, 418], [392, 438], [381, 411]] as Array<Vec2>
  helper.drawImmediately(hand_right_4, gl.TRIANGLE_STRIP, 0, hand_right_4.length, COLORS.SKIN)
  let hand_right_5 = [[347, 361], [390, 401], [365, 417], [376, 444], [389, 438], [387.3, 478.6]] as Array<Vec2>
  helper.drawImmediately(hand_right_5, gl.TRIANGLES, 0, hand_right_5.length, COLORS.SKIN)

  // 尾巴
  let tail_1 = generateBezierCurve2dL3([150.6, 472.6], [136.6, 512.6], [133.3, 547.6], [139, 563])
  helper.drawImmediately(tail_1, gl.TRIANGLE_FAN, 0, tail_1.length, COLORS.GRAY)
  helper.drawImmediately(tail_1, gl.LINE_STRIP, 0, tail_1.length, COLORS.BLACK)
  let tail_2 = generateBezierCurve2dL3([139, 564.3], [106, 571.3], [207.6, 554], [225.3, 508.6])
  helper.drawImmediately(tail_2, gl.TRIANGLE_FAN, 0, tail_2.length, COLORS.GRAY)
  helper.drawImmediately(tail_2, gl.LINE_STRIP, 0, tail_2.length, COLORS.BLACK)
  let tail_3 = [[150.6, 472.6], [138, 565], [225.3, 509.6], [150.6, 472.6], [225.3, 509.6], [224, 489]] as Array<Vec2>
  helper.drawImmediately(tail_3, gl.TRIANGLES, 0, tail_3.length, COLORS.GRAY)

  // 衣服中间 - Part 1
  let cloth_center_1 = [[298.5, 359.75], [281.5, 463], [360, 448]] as Array<Vec2>
  helper.drawImmediately(cloth_center_1, gl.TRIANGLES, 0, cloth_center_1.length, COLORS.DARK)

  // 左腿（正视）
  let leg_left_1 = [[226, 489], [227, 505], [272, 497], [196, 588], [254, 598]] as Array<Vec2>
  helper.drawImmediately(leg_left_1, gl.TRIANGLE_STRIP, 0, leg_left_1.length, COLORS.SKIN)

  // 右腿（正视）
  let leg_right_1 = [[340, 454], [303, 462], [358, 498], [315, 506], [308, 596]] as Array<Vec2>
  helper.drawImmediately(leg_right_1, gl.TRIANGLE_STRIP, 0, leg_right_1.length, COLORS.SKIN)
  let leg_right_2 = [[358, 498], [308, 596], [364, 595]] as Array<Vec2>
  helper.drawImmediately(leg_right_2, gl.TRIANGLES, 0, leg_right_2.length, COLORS.SKIN)

  // 左脚（正视）
  let foot_left_1 = [[262, 599], [187, 585], [270, 670], [169, 662]] as Array<Vec2>
  helper.drawImmediately(foot_left_1, gl.TRIANGLE_STRIP, 0, foot_left_1.length, COLORS.DARK)

  // 右脚（正视）
  let foot_right_1 = [[377, 596], [300, 598], [397, 662], [297, 665]] as Array<Vec2>
  helper.drawImmediately(foot_right_1, gl.TRIANGLE_STRIP, 0, foot_right_1.length, COLORS.DARK)

  // 衣服中间 - Part 2
  let cloth_center_2 = [[360, 448], [280, 467], [387, 484]] as Array<Vec2>
  helper.drawImmediately(cloth_center_2, gl.TRIANGLES, 0, cloth_center_2.length, COLORS.DARK)
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