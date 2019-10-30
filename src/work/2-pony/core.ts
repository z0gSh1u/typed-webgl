// Core code of 2-Pony.
// by z0gSh1u & LongChen

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { DrawingObject3d } from '../../framework/3d/DrawingObject3d'
import { DrawingPackage3d } from '../../framework/3d/DrawingPackage3d'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper3d

let vBuffer: WebGLBuffer // 顶点缓冲区
let textureBuffer: WebGLBuffer // 材质缓冲区
let ctm: Mat // 当前世界矩阵

let Pony: DrawingPackage3d // 小马全身
let PonyTextureManager: Array<WebGLTexture> = [] // 小马材质管理器
let PonyTailAngle: number // 小马尾部当前旋转角度（DEG）
let PonyTailDirection: number // 小马尾部旋转方向，-1或1
let Floor: DrawingPackage3d // 地板
let slowDownId: number//减速计时器编号
let autoRotateId: number//自动旋转计时器编号
let isMouseDown = false
let mouseLastPos: Vec2 // 上一次鼠标位置
let vX = 0 // X轴旋转速度
let vY = 0 // Y轴旋转速度
let curTick: number
let lastTick: number
let isAutoRotating = false // 是否正在自动旋转

// global status recorder
let COORD_SYS = {
  SELF: 0, WORLD: 1
}
let currentCoordSys = COORD_SYS.WORLD

// global constant
const ROTATE_DELTA = 5 // 每次转多少度，角度制
const TRANSLATE_DELTA = 0.010 // 每次平移多少距离，WebGL归一化系
const TAIL_ROTATE_DELTA = 2
const TAIL_ROTATE_LIMIT = 6
const FRICTION = 0.0006//模拟摩擦力，每毫秒降低的速度
const INTERVAL = 40//速度降低的毫秒间隔
const ROTATE_PER_X = 0.2//X轴鼠标拖动旋转的比例
const ROTATE_PER_Y = 0.2//Y轴鼠标拖动旋转的比例
const AUTO_ROTATE_DELTA = 1//自动旋转速度

// main function
let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper3d(canvasDOM, gl, program)
  gl.enable(gl.DEPTH_TEST)

  vBuffer = helper.createBuffer()
  textureBuffer = helper.createBuffer()
  helper.setGlobalSettings(
    vBuffer, 'aPosition', textureBuffer, 'aTexCoord', 'uTexture', 'uWorldMatrix', 'uModelMatrix', 'uExtraMatrix'
  )

  ctm = mat4()
  initializePony()

}

/**
 * 读入模型数据，初始化JS中的模型信息记录变量，传送材质，渲染小马
 */
let initializePony = () => {

  // 不知道为什么小马一出来是背对的，而且还贼高。绕y轴先转180度，再微调一下y坐标位置
  let initModelMap = mult(translate(0, -0.3, 0), rotateY(180)) as Mat

  // 设定小马尾部角度
  PonyTailAngle = 0
  PonyTailDirection = -1

  // 设定小马模型
  Pony = new DrawingPackage3d(initModelMap, ...[
    new DrawingObject3d('body', './model/normed/Pony/pony.obj', './model/texture/Pony/pony.png', 0), // 身体
    new DrawingObject3d('tail', './model/normed/Pony/tail.obj', './model/texture/Pony/tail.png', 1), // 尾巴
    new DrawingObject3d('hairBack', './model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png', 2), // 头发后
    new DrawingObject3d('hairFront', './model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png', 3), // 头发前
    new DrawingObject3d('horn', './model/normed/Pony/horn.obj', './model/texture/Pony/horn.png', 4), // 角
    new DrawingObject3d('leftEye', './model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png', 5), // 左眼
    new DrawingObject3d('rightEye', './model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png', 6), // 右眼
    new DrawingObject3d('teeth', './model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png', 7), // 牙
  ])

  // 设定地板模型
  Floor = new DrawingPackage3d(mat4(), ...[
    new DrawingObject3d('floor', './model/normed/Floor/floor.obj')
  ])
  Floor.setMeshOnly(gl.LINE_LOOP, [0, 0, 0])

  // 材质初次加载完成后渲染一次，把材质绑到WebGL预置变量上
  let renderAfterTextureLoad = (loadedElements: HTMLImageElement[]) => {
    // 把素材图像传送到GPU  
    for (let i = 0; i < loadedElements.length; i++) {
      let no = gl.createTexture() as WebGLTexture
      gl.bindTexture(gl.TEXTURE_2D, no)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loadedElements[i] as HTMLImageElement)
      gl.generateMipmap(gl.TEXTURE_2D)
      PonyTextureManager.push(no)
    }
    // 为预置的材质变量绑定上各部分的材质，材质编号从0开始
    for (let i = 0; i < PonyTextureManager.length; i++) {
      // PonyTextureManager.length == 8
      let cmd1 = `gl.activeTexture(gl.TEXTURE${i})`, cmd2 = `gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[${i}])`
      eval(cmd1); eval(cmd2)
    }
    // 渲染
    resetScene()
    helper.reRender(ctm)
  }

  // 有需要加载外部材质的，在这里加载
  Pony.preloadTexture(renderAfterTextureLoad)

}

/**
 * 重设Pony全身和地面坐标，但不会重传材质，也不会重设模型视图矩阵
 */
let resetScene = () => {
  helper.clearWaitingQueue();
  [Floor, Pony, /*Pen*/].forEach(ele => {
    helper.drawPackageLater(ele)
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
// 重置所有对象位置
(document.querySelector('#resetAll') as HTMLButtonElement).onclick = () => {
  ctm = mat4()
  Pony.setModelMat(mult(translate(0, -0.3, 0), rotateY(180)) as Mat)
  vX = vY = 0
  resetScene()
  helper.reRender(ctm)
}
// 自动旋转开启与停止
(document.querySelector('#autoRotateToggler') as HTMLButtonElement).onclick = () => {
  isAutoRotating = !isAutoRotating
  if (isAutoRotating) {
    (document.querySelector('#autoRotateToggler') as HTMLButtonElement).innerText = '停止旋转'
    clearInterval(autoRotateId)
    setInterval(() => {
      if (!isAutoRotating) {
        clearInterval(autoRotateId)
        return
      }
      if (currentCoordSys == COORD_SYS.SELF) {
        let newMat = mult(Pony.modelMat, rotateY(AUTO_ROTATE_DELTA))
        Pony.setModelMat(newMat as Mat)
      } else {
        ctm = mult(rotateY(AUTO_ROTATE_DELTA), ctm) as Mat
      }
      resetScene()
      helper.reRender(ctm)
    }, INTERVAL)
  } else {
    (document.querySelector('#autoRotateToggler') as HTMLButtonElement).innerText = '开始旋转'
    clearInterval(autoRotateId)
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
    '68'/*D*/: processDKey,
    '37'/*←*/: processLAKey,
    '38'/*↑*/: processUAKey,
    '39'/*→*/: processRAKey,
    '40'/*↓*/: processDAKey
  }
  window.onkeydown = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      try {
        handlers[e.keyCode.toString()].call(null)
      } catch (ex) { }
    }
  }
}

// 尾部旋转处理器
let rotateTail = () => {
  let tailObject = Pony.getObjectByName('tail') as DrawingObject3d
  if (PonyTailAngle >= TAIL_ROTATE_LIMIT || PonyTailAngle <= -TAIL_ROTATE_LIMIT) {
    PonyTailDirection *= -1
  }
  PonyTailAngle += PonyTailDirection * TAIL_ROTATE_DELTA
  let newTailExtra = mult(tailObject.extraMatrix, rotateY(PonyTailAngle))
  Pony.setObjectExtraMatrix('tail', newTailExtra as Mat)
}

// 右方向键，右翻滚
let processRAKey = () => {
  if (currentCoordSys != COORD_SYS.SELF) {
    return
  }
  let newMat = mult(Pony.modelMat, rotateZ(-ROTATE_DELTA))
  Pony.setModelMat(newMat as Mat)
  resetScene()
  helper.reRender(ctm)
}
// 上方向键，后仰
let processUAKey = () => {
  if (currentCoordSys != COORD_SYS.SELF) {
    return
  }
  let newMat = mult(Pony.modelMat, rotateX(-ROTATE_DELTA))
  Pony.setModelMat(newMat as Mat)
  resetScene()
  helper.reRender(ctm)
}
// 左方向键，左翻滚
let processLAKey = () => {
  if (currentCoordSys != COORD_SYS.SELF) {
    return
  }
  let newMat = mult(Pony.modelMat, rotateZ(ROTATE_DELTA))
  Pony.setModelMat(newMat as Mat)
  resetScene()
  helper.reRender(ctm)
}
// 下方向键，前俯
let processDAKey = () => {
  if (currentCoordSys != COORD_SYS.SELF) {
    return
  }
  let newMat = mult(Pony.modelMat, rotateX(ROTATE_DELTA))
  Pony.setModelMat(newMat as Mat)
  resetScene()
  helper.reRender(ctm)
}
// W键，上平移或前进
let processWKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向上平移(y axis add)
    ctm = mult(translate(0, TRANSLATE_DELTA, 0), ctm) as Mat
  } else {
    // 面向前进
    let newMat = mult(Pony.modelMat, translate(0, 0, TRANSLATE_DELTA))
    Pony.setModelMat(newMat as Mat);
    rotateTail()
  }
  resetScene()
  helper.reRender(ctm)
}
// A键，左平移或左转向
let processAKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向左平移(x axis minus)
    ctm = mult(translate(-TRANSLATE_DELTA, 0, 0), ctm) as Mat
  } else {
    // 向左转
    let newMat = mult(Pony.modelMat, rotateY(-ROTATE_DELTA))
    Pony.setModelMat(newMat as Mat)
  }
  resetScene()
  helper.reRender(ctm)
}
// S键，下平移或后退
let processSKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向下平移(y axis minus)
    ctm = mult(translate(0, -TRANSLATE_DELTA, 0), ctm) as Mat
  } else {
    // 面向后退
    let newMat = mult(Pony.modelMat, translate(0, 0, -TRANSLATE_DELTA))
    Pony.setModelMat(newMat as Mat)
    rotateTail()
  }
  resetScene()
  helper.reRender(ctm)
}
// D键，右平移或右转向
let processDKey = () => {
  if (currentCoordSys == COORD_SYS.WORLD) {
    // 向右平移(x axis add)
    ctm = mult(translate(TRANSLATE_DELTA, 0, 0), ctm) as Mat
  } else {
    // 向右转
    let newMat = mult(Pony.modelMat, rotateY(ROTATE_DELTA))
    Pony.setModelMat(newMat as Mat)
  }
  resetScene()
  helper.reRender(ctm)
}
// X键，绕世界系X轴旋转
let processXKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  ctm = mult(rotateX(ROTATE_DELTA), ctm) as Mat
  resetScene()
  helper.reRender(ctm)
}
// Y键，绕世界系Y轴旋转
let processYKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  ctm = mult(rotateY(ROTATE_DELTA), ctm) as Mat
  resetScene()
  helper.reRender(ctm)
}
// Z键，绕世界系Z轴旋转
let processZKey = () => {
  if (currentCoordSys != COORD_SYS.WORLD) {
    return
  }
  ctm = mult(rotateZ(ROTATE_DELTA), ctm) as Mat
  resetScene()
  helper.reRender(ctm)
}

// 鼠标按下时随鼠标旋转
let rotateWithMouse = (e: MouseEvent) => {
  let mousePos = [e.offsetX, e.offsetY] as Vec2
  lastTick = curTick
  curTick = new Date().getTime()
  let disX = (mousePos[0] - mouseLastPos[0]) * ROTATE_PER_X
  let disY = (mousePos[1] - mouseLastPos[1]) * ROTATE_PER_Y
  vX = disX / (curTick - lastTick)
  vY = disY / (curTick - lastTick)
  ctm = mult(rotateX(-disY), ctm) as Mat
  ctm = mult(rotateY(-disX), ctm) as Mat
  mouseLastPos = mousePos
  resetScene()
  helper.reRender(ctm)
}

let abs = (n: number): number => {
  return n < 0 ? -n : n
}

let sign = (n: number): number => {
  if (n == 0) {
    return 0
  } else {
    return abs(n) / n
  }
}

// 松开鼠标后每INTERVAL毫秒进行一次减速
let slowDown = () => {
  if (vX == 0 && vY == 0) {
    clearInterval(slowDownId)
    return
  }
  ctm = mult(rotateX(-vY * INTERVAL), ctm) as Mat
  ctm = mult(rotateY(-vX * INTERVAL), ctm) as Mat
  vX = abs(vX) <= FRICTION * INTERVAL ? 0 : vX - FRICTION * INTERVAL * sign(vX)
  vY = abs(vY) <= FRICTION * INTERVAL ? 0 : vY - FRICTION * INTERVAL * sign(vY)
  resetScene()
  helper.reRender(ctm)
}

// 鼠标侦听
let listenMouse = () => {
  canvasDOM.onmousedown = (e: MouseEvent) => {
    isMouseDown = true
    mouseLastPos = [e.offsetX, e.offsetY] as Vec2
    clearInterval(slowDownId)
    curTick = lastTick = new Date().getTime()
  }
  canvasDOM.onmouseup = (e: MouseEvent) => {
    isMouseDown = false
    clearInterval(slowDownId)
    slowDownId = window.setInterval(slowDown, INTERVAL)
  }
  canvasDOM.onmousemove = (e: MouseEvent) => {
    if (isMouseDown) {
      rotateWithMouse(e)
    }
  }
}

// do it
main()
listenKeyboard()
listenMouse()