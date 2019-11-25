// Core code of 3-Shining.
// by z0gSh1u

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { DrawingObject3d } from '../../framework/3d/DrawingObject3d'
import { DrawingPackage3d } from '../../framework/3d/DrawingPackage3d'
import { PhongLightModel } from '../../framework/3d/PhongLightModel'

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper3d
let vBuffer: WebGLBuffer // 顶点缓冲区
let textureBuffer: WebGLBuffer // 材质缓冲区
let nBuffer: WebGLBuffer // 法向量缓冲区
let ctm: Mat // 当前世界矩阵
let Pony: DrawingPackage3d // 小马全身
let PonyTextureManager: Array<WebGLTexture> = [] // 小马材质管理器
let Floor: DrawingPackage3d // 地板
let slowDownId: number // 减速计时器编号
let isMouseDown = false
let mouseLastPos: Vec2 // 上一次鼠标位置
let vX = 0 // X轴旋转速度
let vY = 0 // Y轴旋转速度
let curTick: number
let lastTick: number
let PonyMaterialInputDOMs: Array<string> = []
let PonyMaterialCorrespondings: Array<string> = []
// global constant
const FRICTION = 0.0006 // 模拟摩擦力，每毫秒降低的速度
const INTERVAL = 40 // 速度降低的毫秒间隔
const ROTATE_PER_X = 0.2 // X轴鼠标拖动旋转的比例
const ROTATE_PER_Y = 0.2 // Y轴鼠标拖动旋转的比例
let lightBulbPosition = vec3(0, 0, 0)
// material parameters
let PonyMaterial = new PhongLightModel({
  lightPosition: lightBulbPosition,
  ambientColor: [50, 50, 50],
  ambientMaterial: [50, 50, 50],
  diffuseColor: [192, 149, 83],
  diffuseMaterial: [50, 100, 100],
  specularColor: [255, 255, 255],
  specularMaterial: [45, 45, 45],
  materialShiness: 10.0
})
let FloorMaterial = new PhongLightModel({
  lightPosition: lightBulbPosition,
  ambientColor: [50, 50, 50],
  ambientMaterial: [50, 50, 50],
  diffuseColor: [192, 149, 83],
  diffuseMaterial: [50, 100, 100],
  specularColor: [255, 255, 255],
  specularMaterial: [45, 45, 45],
  materialShiness: 10.0
})

// main function
let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper3d(canvasDOM, gl, program)
  gl.enable(gl.DEPTH_TEST)

  vBuffer = helper.createBuffer()
  textureBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()

  helper.setGlobalSettings(
    vBuffer, 'aPosition', textureBuffer, 'aTexCoord', 'uTexture',
    'uWorldMatrix', 'uModelMatrix', 'uExtraMatrix', nBuffer, 'aNormal',
    'uLightPosition', 'uShiness', 'uAmbientProduct', 'uDiffuseProduct', 'uSpecularProduct'
  )

  ctm = mat4()
  initializePony()

}

/**
 * 读入模型数据，初始化JS中的模型信息记录变量，传送材质，渲染小马
 */
let initializePony = () => {

  // 设定小马模型
  Pony = new DrawingPackage3d(mult(translate(0, -0.3, 0), mult(rotateZ(180), rotateX(270))) as Mat, ...[
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

  // 设定地板模型
  Floor = new DrawingPackage3d(mat4(), ...[
    new DrawingObject3d('floor', './model/normed/Floor/floor.obj')
  ])
  Floor.setMeshOnly(gl.TRIANGLE_STRIP, [111, 193, 255])

  Pony.preloadTexture(ponyLoadedCallback)

}

// 材质初次加载完成后渲染一次，把材质绑到WebGL预置变量上
let ponyLoadedCallback = (loadedElements: HTMLImageElement[]) => {
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
  reRenderLighting()
  helper.reRender(mat4() as Mat)
}

/**
 * 重设Pony全身和地面坐标，但不会重传材质，也不会重设模型视图矩阵
 */
let resetScene = () => {
  helper.clearWaitingQueue();
  [Floor, Pony].forEach(ele => {
    helper.drawPackageLater(ele)
  })
}

let reRenderLighting = (posOnly: boolean = false) => {
  [PonyMaterial, FloorMaterial].forEach(ele => {
    ele.reCalculateProducts()
  })
  helper.setLighting(PonyMaterial)
  helper.updateLighting()
}

// ===============================
// 光源交互相关
// ===============================
/**
 * 初始化位置输入框
 */
let initPositionInput = () => {
  (document.querySelector('#lightPosX') as HTMLInputElement).value = lightBulbPosition[0].toString();
  (document.querySelector('#lightPosY') as HTMLInputElement).value = lightBulbPosition[1].toString();
  (document.querySelector('#lightPosZ') as HTMLInputElement).value = lightBulbPosition[2].toString()
}
/**
 * 调节位置
 */
let listenPositionInput = () => {
  (document.querySelector('#applyLightPos') as HTMLButtonElement).onclick = () => {
    let xx = (document.querySelector('#lightPosX') as HTMLInputElement).value,
      yy = (document.querySelector('#lightPosY') as HTMLInputElement).value,
      zz = (document.querySelector('#lightPosZ') as HTMLInputElement).value
    lightBulbPosition = ([xx, yy, zz].map(_ => parseFloat(_))) as Vec3
    [PonyMaterial, FloorMaterial].forEach(ele => {
      ele.setLightPosition(lightBulbPosition)
    })
    reRenderLighting(true)
    helper.reRender(ctm)
  }
}
/**
 * 初始化材质颜色参量输入框
 */
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
/**
 * 调节小马材质颜色参量
 */
let listenPonyMaterialInput = () => {
  (document.querySelector('#applyLightparam') as HTMLButtonElement).onclick = () => {
    PonyMaterialCorrespondings.forEach((v, idx) => {
      if (idx == 9) {
        eval(`${v}=parseInt(document.querySelector('${PonyMaterialInputDOMs[idx]}').value)`)
      } else {
        eval(`${v}=parseInt(document.querySelector('${PonyMaterialInputDOMs[idx]}').value)/255`)
      }
    })
    reRenderLighting(false)
    helper.reRender(ctm as Mat)
  }
}

// ===============================
// 跟踪球实现
// ===============================
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
initPositionInput()
initPonyMaterialInput()
listenPonyMaterialInput()
listenPositionInput()
listenMouse()