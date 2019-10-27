// Core code of 2-Pony.

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { DrawingObject3d } from '../../framework/3d/DrawingObject3d'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper3d

let vBuffer: WebGLBuffer // 顶点缓冲区
let textureBuffer: WebGLBuffer // 材质缓冲区
let ctm: Mat // 当前世界矩阵
let modelMat: Mat // 当前物体自身矩阵

let Pony: Array<DrawingObject3d> = [] // 小马全身

// global status recorder
let COORD_SYS = {
  SELF: 0, WORLD: 1
}
let currentCoordSys = COORD_SYS.WORLD

// global constant
const ROTATE_DELTA = 10 // 每次转多少度，角度制
const TRANSLATE_DELTA = 0.010 // 每次平移多少距离，WebGL归一化系

// main function
let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper3d(canvasDOM, gl, program)
  gl.enable(gl.DEPTH_TEST)
  // gl.enable(gl.CULL_FACE)

  vBuffer = helper.createBuffer()
  textureBuffer = helper.createBuffer()
  helper.setGlobalSettings(vBuffer, 'aPosition', textureBuffer, 'aTexCoord')

  // 不知道为什么小马一出来是背对的，而且还贼高。绕y轴先转180度，再微调一下y坐标位置
  ctm = rotateY(180)
  ctm = mult(translate(0, -0.2, 0), ctm) as Mat
  modelMat = mat4()

  initializePony()
  // resetPony()
  // helper.reRender(ctm, modelMat)

}


let PonyTextureManager: Array<WebGLTexture> = []

// 读入模型数据，初始化JS中的模型信息记录变量
let initializePony = () => {

  Pony = [
    new DrawingObject3d('./model/normed/Pony/pony.obj', './model/texture/Pony/pony.png'), // 身体
    new DrawingObject3d('./model/normed/Pony/tail.obj', './model/texture/Pony/tail.png'), // 尾巴
    new DrawingObject3d('./model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png'), // 头发后
    new DrawingObject3d('./model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png'), // 头发前
    new DrawingObject3d('./model/normed/Pony/horn.obj', './model/texture/Pony/horn.png'), // 角
    new DrawingObject3d('./model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png'), // 左眼
    new DrawingObject3d('./model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png'), // 右眼
    new DrawingObject3d('./model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png'), // 牙
  ]

  function preloadimages(arr: Array<DrawingObject3d>) {
    var newimages: Array<HTMLImageElement> = [], loadedimages = 0
    var postaction = function (ni: HTMLImageElement[]) {

      for (let i = 0; i < ni.length; i++) {

        Pony[i]._textureImage = ni[i]

        let no = gl.createTexture() as WebGLTexture

        gl.bindTexture(gl.TEXTURE_2D, no)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Pony[i]._textureImage as HTMLImageElement)

        gl.generateMipmap(gl.TEXTURE_2D)

        PonyTextureManager.push(no)

      }


      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[0]);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[1]);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[2]);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[3]);
      gl.activeTexture(gl.TEXTURE5);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[4]);
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[5]);
      gl.activeTexture(gl.TEXTURE7);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[6]);
      gl.activeTexture(gl.TEXTURE8);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[7]);
      gl.activeTexture(gl.TEXTURE9);
      gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[8]);

      resetPony()
      helper.reRender(ctm, modelMat)

    }
    var arr = (typeof arr != "object") ? [arr] : arr
    function imageloadpost() {
      loadedimages++
      if (loadedimages == arr.length) {
        postaction(newimages) //call postaction and pass in newimages array as parameter
      }
    }
    for (var i = 0; i < arr.length; i++) {
      newimages[i] = new Image()
      newimages[i].src = arr[i].texturePath
      newimages[i].onload = function () {
        imageloadpost()
      }
      newimages[i].onerror = function () {
        imageloadpost()
      }
    }
  }

  preloadimages(Pony)

}

let resetPony = () => {
  helper.clearWaitingQueue()
  Pony.forEach(ele => {
    helper.drawLater(ele)
  })
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
    ctm = mult(translate(0, TRANSLATE_DELTA, 0), ctm) as Mat
    resetPony()
    helper.reRender(ctm, mat4())
  }
}
// A键，左平移或左转向
let processAKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向左平移(x axis minus)
    ctm = mult(translate(-TRANSLATE_DELTA, 0, 0), ctm) as Mat
    resetPony()
    helper.reRender(ctm, mat4())
  }
}
// S键，下平移或后退
let processSKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向下平移(y axis minus)
    ctm = mult(translate(0, -TRANSLATE_DELTA, 0), ctm) as Mat
    resetPony()
    helper.reRender(ctm, mat4())
  }
}
// D键，右平移或右转向
let processDKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向右平移(x axis add)
    ctm = mult(translate(TRANSLATE_DELTA, 0, 0), ctm) as Mat
    resetPony()
    helper.reRender(ctm, mat4())
  }
}
// X键，绕世界系X轴旋转
let processXKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  ctm = mult(rotateX(ROTATE_DELTA), ctm) as Mat
  resetPony()
  helper.reRender(ctm, mat4())
}
// Y键，绕世界系Y轴旋转
let processYKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  ctm = mult(rotateY(ROTATE_DELTA), ctm) as Mat
  resetPony()
  helper.reRender(ctm, mat4())
}
// Z键，绕世界系Z轴旋转
let processZKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  ctm = mult(rotateZ(ROTATE_DELTA), ctm) as Mat
  resetPony()
  helper.reRender(ctm, mat4())
}

// do it
main()
listenKeyboard()