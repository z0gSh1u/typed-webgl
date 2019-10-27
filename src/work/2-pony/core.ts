// Core code of 2-Pony.

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { OBJProcessor } from '../../framework/3d/OBJProcessor'

// use axios
declare var axios: any

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper3d
let vBuffer: WebGLBuffer

let ctm: Mat // current world matrix
let ponyVertices: Array<Vec3> = []
let objProcessor: OBJProcessor

// global status recorder
let COORD_SYS = {
  SELF: 0, WORLD: 1
}
let currentCoordSys = COORD_SYS.WORLD

// global constant
const ROTATE_DELTA = 10 // 每次转多少度，角度制
const COS_RD = Math.cos(radians(ROTATE_DELTA))
const SIN_RD = Math.sin(radians(ROTATE_DELTA))
const TRANSLATE_DELTA = 0.010 // 每次平移多少距离，WebGL归一化系

// main function
let main = () => {
  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper3d(canvasDOM, gl, program)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  vBuffer = helper.createBuffer()

  initializePony()
}

// 坐标系切换处理
(document.querySelector('#coordToggler') as HTMLButtonElement).onclick = () => {
  currentCoordSys = (currentCoordSys + 1) % 2
  if (currentCoordSys == COORD_SYS.SELF) {
    (document.querySelector('#curCoord_screen') as HTMLParagraphElement).style.display = 'none';
    (document.querySelector('#curCoord_object') as HTMLParagraphElement).style.display = 'inline-block';
  } else {
    (document.querySelector('#curCoord_screen') as HTMLParagraphElement).style.display = 'inline-block';
    (document.querySelector('#curCoord_object') as HTMLParagraphElement).style.display = 'none';
  }
}

// initialize the pony
async function initializePony() {

  // 读OBJ并处理
  {
    let responseData: string = ''
    await axios.get('./model/normed/pony.obj').then((res: any) => {
      responseData = res.data
    })
    objProcessor = new OBJProcessor(responseData)
  }

  // 把各个面的组成推进去
  objProcessor.fs.forEach(face => {
    face.forEach(vOfFace => {
      let subscript = vOfFace - 1
      ponyVertices.push(objProcessor.vs[subscript]) // xyzxyzxyz
    })
  })

  helper.useBuffer(vBuffer)
  helper.sendDataToBuffer(flatten(ponyVertices))
  helper.vertexSettingMode(vBuffer, 'aPosition', 3)

  helper.setUniformColor('uColor', [0, 0, 0])

  ctm = mat4()
  reRender()

}

// 重渲染
let reRender = () => {
  helper.clearCanvas()
  helper.setUniformMatrix4d('uWorldMatrix', ctm)
  helper.setUniformMatrix4d('uModelMatrix', mat4())
  helper.drawArrays(gl.LINE_LOOP, 0, objProcessor.getEffectiveVertexCount())
}

// 键盘监听
let listenKeyboard = () => {
  let handlers: { [key: string]: () => void } = {
    '88'/*X*/: processXKey,
    '89'/*Y*/: processYKey,
    '90'/*Z*/: processZKey,
    '87'/*W*/: processWKey,
    '65'/*A*/: processAKey,
    '83'/*S*/: processSKey,
    '68'/*D*/: processDKey
  }
  window.onkeydown = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      try {
        handlers[e.keyCode.toString()].call(null)
      } catch (ex) { }
    }
  }
}
// W键，上平移或前进
let processWKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向上平移(y axis add)
    let transMat = mat4(
      1, 0, 0, 0,
      0, 1, 0, TRANSLATE_DELTA,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
    ctm = mult(transMat, ctm) as Mat
    helper.setUniformMatrix4d('uWorldMatrix', ctm)
    reRender()
  }
}
// A键，左平移或左转向
let processAKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向左平移(x axis minus)
    let transMat = mat4(
      1, 0, 0, -TRANSLATE_DELTA,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
    ctm = mult(transMat, ctm) as Mat
    helper.setUniformMatrix4d('uWorldMatrix', ctm)
    reRender()
  }
}
// S键，下平移或后退
let processSKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向下平移(y axis minus)
    let transMat = mat4(
      1, 0, 0, 0,
      0, 1, 0, -TRANSLATE_DELTA,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
    ctm = mult(transMat, ctm) as Mat
    helper.setUniformMatrix4d('uWorldMatrix', ctm)
    reRender()
  }
}
// D键，右平移或右转向
let processDKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向右平移(x axis add)
    let transMat = mat4(
      1, 0, 0, TRANSLATE_DELTA,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
    ctm = mult(transMat, ctm) as Mat
    helper.setUniformMatrix4d('uWorldMatrix', ctm)
    reRender()
  }
}
// X键，绕世界系X轴旋转
let processXKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  let transMat = mat4(
    1, 0, 0, 0,
    0, COS_RD, -SIN_RD, 0,
    0, SIN_RD, COS_RD, 0,
    0, 0, 0, 1
  )
  ctm = mult(transMat, ctm) as Mat
  helper.setUniformMatrix4d('uWorldMatrix', ctm)
  reRender()
}
// Y键，绕世界系Y轴旋转
let processYKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  let transMat = mat4(
    COS_RD, 0, SIN_RD, 0,
    0, 1, 0, 0,
    -SIN_RD, 0, COS_RD, 0,
    0, 0, 0, 1
  )
  ctm = mult(transMat, ctm) as Mat
  helper.setUniformMatrix4d('uWorldMatrix', ctm)
  reRender()
}
// Z键，绕世界系Z轴旋转
let processZKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  let transMat = mat4(
    COS_RD, -SIN_RD, 0, 0,
    SIN_RD, COS_RD, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
  ctm = mult(transMat, ctm) as Mat
  helper.setUniformMatrix4d('uWorldMatrix', ctm)
  reRender()
}


// do it
main()
listenKeyboard()