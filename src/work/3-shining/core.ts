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

let lightBulbPosition = vec3(0.5, 0.5, 0.5)

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
}
)
let FloorMaterial = new PhongLightModel({
  lightPosition: lightBulbPosition,
  ambientColor: [50, 50, 50],
  ambientMaterial: [50, 50, 50],
  diffuseColor: [192, 149, 83],
  diffuseMaterial: [50, 100, 100],
  specularColor: [255, 255, 255],
  specularMaterial: [45, 45, 45],
  materialShiness: 10.0
}
)

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
  // Floor.setMeshOnly(gl.LINE_LOOP, [0, 0, 0])
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
  testLight()
  helper.reRender(mult(ctm, rotateX(30)) as Mat)
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

let testLight = () => {

  helper.setLighting(PonyMaterial)
  helper.updateLighting()

}

// do it
main()
