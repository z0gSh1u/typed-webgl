// Core code of 3-Shining.
// by z0gSh1u & LongChen.
import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { DrawingObject3d } from '../../framework/3d/DrawingObject3d'
import { DrawingPackage3d } from '../../framework/3d/DrawingPackage3d'
import { PhongLightModel } from '../../framework/3d/PhongLightModel'
// ==================================
// 主要变量
// ==================================
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl', { alpha: true,  premultipliedAlpha: false }) as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = {
  MAIN: 0, BACKGROUND: 1, RECT: 2
}
let MODES = {
  TRACKBALL: 0, FPV: 1, LIGHT: 2
}
let currentMode = MODES.TRACKBALL
// ==================================
// 主体渲染使用
// ==================================
let lightBulbPosition = vec3(0.0, 0.0, 0.0) // 光源位置
let vBuffer: WebGLBuffer // 顶点缓冲区
let nBuffer: WebGLBuffer // 法向量缓冲区
let tBuffer: WebGLBuffer // 材质顶点缓冲区
let ctm: Mat // 当前世界矩阵
let Pony: DrawingPackage3d // 小马全身
let PonyMaterial = new PhongLightModel({ // 小马光照参数
  lightPosition: lightBulbPosition,
  ambientColor: [255, 255, 255],
  ambientMaterial: [200, 200, 200],
  diffuseColor: [255, 255, 255],
  diffuseMaterial: [66, 66, 66],
  specularColor: [255, 255, 255],
  specularMaterial: [200, 200, 200],
  materialShiness: 30.0
})
// ==================================
// 背景渲染使用
// ==================================
let BackgroundTexture: WebGLTexture
let bgVBuffer: WebGLBuffer
let bgTBuffer: WebGLBuffer
// ==================================
// 光球渲染使用
// ==================================
let lightBallPosition = lightBulbPosition
let lbVBuffer: WebGLBuffer
let lbTBuffer: WebGLBuffer
// ==================================
// 跟踪球使用
// ==================================
const FRICTION = 0.0006 // 模拟摩擦力，每毫秒降低的速度
const INTERVAL = 40 // 速度降低的毫秒间隔
const ROTATE_PER_X = 0.2 // X轴鼠标拖动旋转的比例
const ROTATE_PER_Y = 0.2 // Y轴鼠标拖动旋转的比例
let slowDownId: number // 减速计时器编号
let isMouseDown = false
let mouseLastPos: Vec2 // 上一次鼠标位置
let vX = 0 // X轴旋转速度
let vY = 0 // Y轴旋转速度
let curTick: number
let lastTick: number
let PonyMaterialInputDOMs: Array<string> = []
let PonyMaterialCorrespondings: Array<string> = []
// 初始化
// TODO: 消除Callback-Hell
let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/vMain.glsl', './shader/fMain.glsl'),
    WebGLUtils.initializeShaders(gl, './shader/vBackground.glsl', './shader/fBackground.glsl'),
    WebGLUtils.initializeShaders(gl, './shader/vRect.glsl', './shader/fRect.glsl'),
  ])
  gl.enable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.enable(gl.BLEND)
  // 初始化各buffer
  vBuffer = helper.createBuffer()
  tBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()
  bgVBuffer = helper.createBuffer()
  bgTBuffer = helper.createBuffer()
  lbVBuffer = helper.createBuffer()
  lbTBuffer = helper.createBuffer()
  ctm = mat4()
  // 保证背景渲染
  initBackground()
}
// 初始化背景图
let initBackground = () => {
  WebGLUtils.loadImageAsync(['./model/bg.png'])
    .then((data) => {
      // 分配背景材质位置为9
      initBackgroundCallback(data as HTMLImageElement[])
    })
    .catch((what) => {
      console.warn(what)
    })
}
let initBackgroundCallback = (data: HTMLImageElement[]) => {
  helper.sendTextureImageToGPU(data as HTMLImageElement[], 9, 10)
  initLightBall()
}
// 重绘背景
let reRenderBackground = () => {
  helper.switchProgram(PROGRAMS.BACKGROUND)
  let VBack = [
    [-1.0, -1.0], [1.0, -1.0],
    [1.0, 1.0], [-1.0, 1.0]
  ],
    vTBack = [
      [0.0, 0.0], [1.0, 0.0],
      [1.0, 1.0], [0.0, 1.0]
    ]
  // 发送背景顶点信息
  helper.prepare({
    attributes: [
      { buffer: bgVBuffer, data: flatten(VBack), varName: 'aPosition', attrPer: 2, type: gl.FLOAT },
      { buffer: bgTBuffer, data: flatten(vTBack), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT }
    ],
    uniforms: [
      { varName: 'uTexture', data: 9, method: '1i' }
    ]
  })
  helper.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}
// 读入模型数据，初始化JS中的模型信息记录变量，传送材质，渲染小马
let initPony = () => {
  // 设定小马模型
  Pony = new DrawingPackage3d(mult(translate(0, -0.35, 0), mult(rotateZ(180), rotateX(270))) as Mat, ...[
    new DrawingObject3d('body', './model/normed/Pony/pony.obj', './model/texture/Pony/pony.png', 0), // 身体
    new DrawingObject3d('tail', './model/normed/Pony/tail.obj', './model/texture/Pony/tail.png', 1), // 尾巴
    new DrawingObject3d('hairBack', './model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png', 2), // 头发后
    new DrawingObject3d('hairFront', './model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png', 3), // 头发前
    new DrawingObject3d('horn', './model/normed/Pony/horn.obj', './model/texture/Pony/horn.png', 4), // 角
    new DrawingObject3d('leftEye', './model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png', 5), // 左眼
    new DrawingObject3d('rightEye', './model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png', 6), // 右眼
    new DrawingObject3d('teeth', './model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png', 7), // 牙
    new DrawingObject3d('eyelashes', './model/normed/Pony/eyelashes.obj', './model/texture/Pony/eyelashes.png', 8), // 睫毛
  ])
  let urls: Array<string> = []
  Pony.innerList.forEach(obj => {
    urls.push(obj.texturePath)
  })
  WebGLUtils.loadImageAsync(urls)
    .then((data) => {
      ponyLoadedCallback(data as HTMLImageElement[])
    })
}
// 材质初次加载完成后渲染一次
let ponyLoadedCallback = (loadedElements: HTMLImageElement[]) => {
  helper.sendTextureImageToGPU(loadedElements, 0, 9)
  reRender(ctm)
}
// 重绘MAIN
let reRenderMain = (ctm: Mat) => {
  helper.switchProgram(PROGRAMS.MAIN)
  helper.prepare({
    attributes: [],
    uniforms: [
      { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
      { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
      { varName: 'uLightPosition', data: [...PonyMaterial.lightPosition, 1.0], method: '4fv' },
      { varName: 'uShiness', data: PonyMaterial.materialShiness, method: '1f' },
      { varName: 'uAmbientProduct', data: PonyMaterial.ambientProduct, method: '4fv' },
      { varName: 'uDiffuseProduct', data: PonyMaterial.diffuseProduct, method: '4fv' },
      { varName: 'uSpecularProduct', data: PonyMaterial.specularProduct, method: '4fv' },
    ]
  })
  Pony.innerList.forEach(obj => {
    let vs = helper.analyzeFtoV(obj, 'fs'),
      vts = helper.analyzeFtoV(obj, 'fts'),
      vns = helper.analyzeFtoV(obj, 'fns')
    helper.prepare({
      attributes: [
        { buffer: vBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
        { buffer: tBuffer, data: flatten(vts), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT },
        { buffer: nBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
      ],
      uniforms: [
        { varName: 'uTexture', data: obj.textureIndex, method: '1i' },
      ]
    })
    helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())
  })
}

// 绘制光球
let initLightBall = () => {
  WebGLUtils.loadImageAsync(['./model/lightBall.png'])
    .then(data => {
      lightBallLoadedCallback(data as HTMLImageElement[])
    })
}
let lightBallLoadedCallback = (loadedImages: HTMLImageElement[]) => {
  // 分配10号材质位置
  helper.sendTextureImageToGPU(loadedImages, 10, 11)
  initPony()
}
let reRenderLightBall = () => {
  helper.switchProgram(PROGRAMS.BACKGROUND)
  let VRect = [
    [0.7, 0.7, -0.01],
    [0.7, 0.95, -0.01],
    [0.95, 0.95, -0.01],
    [0.95, 0.7, -0.01]
  ],
    vTRect = [
      [0.0, 0.0], [1.0, 0.0],
      [1.0, 1.0], [0.0, 1.0]
    ]
  // 发送背景顶点信息
  helper.prepare({
    attributes: [
      { buffer: lbVBuffer, data: flatten(VRect), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
      { buffer: lbTBuffer, data: flatten(vTRect), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT }
    ],
    uniforms: [
      { varName: 'uTexture', data: 10, method: '1i' }
    ]
  })
  helper.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

// reRender
let reRender = (ctm: Mat, reCalulateMaterialProducts: boolean = false) => {
  reCalulateMaterialProducts && PonyMaterial.reCalculateProducts()
  //reRenderLightBall()
  reRenderBackground()
  reRenderMain(ctm)
}
// ===============================
// 光源交互相关
// ===============================
// 初始化位置输入框
let initPositionInput = () => {
  (document.querySelector('#lightPosX') as HTMLInputElement).value = lightBulbPosition[0].toString();
  (document.querySelector('#lightPosY') as HTMLInputElement).value = lightBulbPosition[1].toString();
  (document.querySelector('#lightPosZ') as HTMLInputElement).value = lightBulbPosition[2].toString()
}
// 调节位置
let listenPositionInput = () => {
  (document.querySelector('#applyLightPos') as HTMLButtonElement).onclick = () => {
    let xx = (document.querySelector('#lightPosX') as HTMLInputElement).value,
      yy = (document.querySelector('#lightPosY') as HTMLInputElement).value,
      zz = (document.querySelector('#lightPosZ') as HTMLInputElement).value
    lightBulbPosition = ([xx, yy, zz].map(_ => parseFloat(_))) as Vec3
    PonyMaterial.setLightPosition(lightBulbPosition)
    reRender(ctm, true)
  }
}
// 初始化材质颜色参量输入框
let initPonyMaterialInput = () => {
  PonyMaterialInputDOMs = ['#colorinputAR', '#colorinputAG', '#colorinputAB', '#colorinputDR',
    '#colorinputDG', '#colorinputDB', '#colorinputSR',
    '#colorinputSG', '#colorinputSB', '#shinessinput']
  PonyMaterialCorrespondings = [
    'PonyMaterial.ambientMaterial[0]', 'PonyMaterial.ambientMaterial[1]', 'PonyMaterial.ambientMaterial[2]',
    'PonyMaterial.diffuseMaterial[0]', 'PonyMaterial.diffuseMaterial[1]', 'PonyMaterial.diffuseMaterial[2]',
    'PonyMaterial.specularMaterial[0]', 'PonyMaterial.specularMaterial[1]', 'PonyMaterial.specularMaterial[2]',
    'PonyMaterial.materialShiness'
  ]
  PonyMaterialCorrespondings.forEach((v, idx) => {
    if (idx == 9) {
      eval(`document.querySelector('${PonyMaterialInputDOMs[idx]}').value=(Math.floor(${v})).toString()`)
    } else {
      eval(`document.querySelector('${PonyMaterialInputDOMs[idx]}').value=(Math.floor(${v}*255)).toString()`)
    }
  })
}
// 调节小马材质颜色参量
let listenPonyMaterialInput = () => {
  (document.querySelector('#applyLightparam') as HTMLButtonElement).onclick = () => {
    PonyMaterialCorrespondings.forEach((v, idx) => {
      if (idx == 9) {
        eval(`${v}=parseInt(document.querySelector('${PonyMaterialInputDOMs[idx]}').value)`)
      } else {
        eval(`${v}=parseInt(document.querySelector('${PonyMaterialInputDOMs[idx]}').value)/255`)
      }
    })
    reRender(ctm, true)
  }
}
// 光源互动模式
let listenMouseLightInteract = () => {

}


// ===============================
// 跟踪球实现
// ===============================
// 鼠标按下时随鼠标旋转
let rotateWithMouse = (e: MouseEvent) => {
  let mousePos = [e.offsetX, e.offsetY] as Vec2
  lastTick = curTick; curTick = new Date().getTime()
  let disX = (mousePos[0] - mouseLastPos[0]) * ROTATE_PER_X
    , disY = (mousePos[1] - mouseLastPos[1]) * ROTATE_PER_Y
  vX = disX / (curTick - lastTick); vY = disY / (curTick - lastTick)
  ctm = mult(rotateX(-disY), ctm) as Mat
  ctm = mult(rotateY(-disX), ctm) as Mat
  mouseLastPos = mousePos
  reRender(ctm)
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
  reRender(ctm)
}
// 鼠标侦听
let listenMouseTrackBall = () => {
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
// ===============================
// 模式切换
// ===============================
let listenModeToggler = () => {
  (document.querySelector('#modeToggler') as HTMLButtonElement).onclick = () => {
    eval(`document.querySelector('#mode_${currentMode}').style.display = 'none'`)
    currentMode = (currentMode + 1) % 3
    eval(`document.querySelector('#mode_${currentMode}').style.display = 'inline-block'`)
  }
}
let clearMouseHooks = () => {
  canvasDOM.onmousedown = () => { }
  canvasDOM.onmouseup = () => { }
  canvasDOM.onmousemove = () => { }
}


// do it
window.onload = () => {
  main()
  initPositionInput()
  initPonyMaterialInput()
  listenPonyMaterialInput()
  listenPositionInput()
  listenModeToggler()
  listenMouseTrackBall()
}
// ===============================
// Fin. 2019-11-27.
// ===============================