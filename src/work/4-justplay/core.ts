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
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = { PONY: 0, SKYBOX: 1 }
// ==================================
// 主体渲染使用
// ==================================
let lightBulbPosition = vec3(0.0, 0.0, 0.0) // 光源位置
let PonyVBuffer: WebGLBuffer // 顶点缓冲区
let PonyNBuffer: WebGLBuffer // 法向量缓冲区
let PonyTBuffer: WebGLBuffer // 材质顶点缓冲区
let ctm: Mat // 当前世界矩阵
let lightCtm: Mat // [暂时的权宜] 由于观察需要覆写全局ctm，故保留一份备份用于光照计算
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
// 透视使用
// ==================================
let cpm: Mat
let fovy = 45.0
let aspect = -1
let near = 0.1
let far = 5.0
let preCalculatedCPM = perspective(fovy, aspect, near, far)
// ==================================
// 观察相机使用
// !! 请注意，pos->at与pos->up不能共线 !!
// ==================================
const ROTATE_PER_Y_FPV = 0.09
const ROTATE_PER_X_FPV = 0.09
const VEC_Y = vec3(0.0, 1.0, 0.0)
const ANGLE_UP_MAX = 89
const ANGLE_DOWN_MAX = -89
const VEC_UP_MAX = vec4(0.0, Math.sin(ANGLE_UP_MAX), Math.cos(ANGLE_UP_MAX), 1)
const VEC_DOWN_MAX = vec4(0.0, Math.sin(ANGLE_DOWN_MAX), Math.cos(ANGLE_DOWN_MAX), 1)
let cameraPos = vec3(0.0, 0.0, -3.0)
let cameraFront = vec3(0.0, 0.0, 1.0)
let cameraSpeed = 0.04
let cameraMoveId: number = 0 // 相机移动计时器编号
const INTERVAL = 40 // 速度降低的毫秒间隔
let lastTick: number
// 初始化
let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/vMain.glsl', './shader/fMain.glsl'),
    WebGLUtils.initializeShaders(gl, './shader/vBackground.glsl', './shader/fBackground.glsl'),
  ])
  gl.enable(gl.DEPTH_TEST)
  // 初始化各buffer
  PonyVBuffer = helper.createBuffer()
  PonyTBuffer = helper.createBuffer()
  PonyNBuffer = helper.createBuffer()
  bgVBuffer = helper.createBuffer()
  bgTBuffer = helper.createBuffer()
  ctm = mat4()
  cpm = mat4()
  lightCtm = mat4()
  await startSceneInit()
}
// 场景初始化
let startSceneInit = async () => {
  // 初始化背景图，分配9号纹理
  helper.sendTextureImageToGPU(await WebGLUtils.loadImageAsync(['./model/bg.png']), 9, 10)
  // 设定光球模型
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
  // 设置小马纹理，0-8号
  let urls: Array<string> = []
  Pony.innerList.forEach(obj => {
    urls.push(obj.texturePath)
  })
  helper.sendTextureImageToGPU(await WebGLUtils.loadImageAsync(urls), 0, 9)
  reRender(ctm)
}
// 重绘背景
let reRenderBackground = () => {
  helper.switchProgram(PROGRAMS.SKYBOX)
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
// 重绘MAIN
let reRenderMain = (ctm: Mat) => {
  helper.switchProgram(PROGRAMS.PONY)
  helper.prepare({
    attributes: [],
    uniforms: [
      { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
      { varName: 'uLightCtm', data: flatten(lightCtm), method: 'Matrix4fv' },
      { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
      { varName: 'uProjectionMatrix', data: flatten(cpm), method: 'Matrix4fv' },
      { varName: 'uLightPosition', data: [...lightBulbPosition, 1.0], method: '4fv' },
      { varName: 'uShiness', data: PonyMaterial.materialShiness, method: '1f' },
      { varName: 'uAmbientProduct', data: PonyMaterial.ambientProduct, method: '4fv' },
      { varName: 'uDiffuseProduct', data: PonyMaterial.diffuseProduct, method: '4fv' },
      { varName: 'uSpecularProduct', data: PonyMaterial.specularProduct, method: '4fv' },
      {
        varName: 'uWorldMatrixTransInv', data: flatten(transpose(inverse(mat3(
          Pony.modelMat[0][0], Pony.modelMat[0][1], Pony.modelMat[0][2],
          Pony.modelMat[1][0], Pony.modelMat[1][1], Pony.modelMat[1][2],
          Pony.modelMat[2][0], Pony.modelMat[2][1], Pony.modelMat[2][2],
        )))), method: 'Matrix3fv'
      },
    ]
  })
  Pony.innerList.forEach(obj => {
    let vs = helper.analyzeFtoV(obj, 'fs'),
      vts = helper.analyzeFtoV(obj, 'fts'),
      vns = helper.analyzeFtoV(obj, 'fns')
    helper.prepare({
      attributes: [
        { buffer: PonyVBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
        { buffer: PonyTBuffer, data: flatten(vts), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT },
        { buffer: PonyNBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
      ],
      uniforms: [
        { varName: 'uTexture', data: obj.textureIndex, method: '1i' },
      ]
    })
    helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())

  })

  // reRender
  let reRender = (ctm: Mat, reCalulateMaterialProducts: boolean = false, lightPosChanged: boolean = false) => {
    if (reCalulateMaterialProducts) {

      PonyMaterial.reCalculateProducts()
    }
    cpm = preCalculatedCPM
    ctm = lookAt(cameraPos, add(cameraPos, cameraFront) as Vec3, VEC_Y)
    reRenderBackground()
    reRenderMain(ctm)
  }
  // ==================================
  // 第一人称视角实现
  // ==================================
  // 鼠标侦听
  let listenMouseToTurnCamera = () => {
    canvasDOM.onmousedown = (evt: MouseEvent) => {
      let mousePoint = [evt.offsetX, evt.offsetY] as Vec2
      let lastTrickTick = new Date().getTime()
      let curTrickTick = lastTick
      const MIN_INTERVAL = 40
      canvasDOM.onmousemove = (evt2: MouseEvent) => {
        curTrickTick = new Date().getTime()
        if (curTrickTick - lastTrickTick < MIN_INTERVAL) {
          return
        }
        lastTrickTick = curTrickTick
        let newMousePoint = [evt2.offsetX, evt2.offsetY] as Vec2
        let translateVector = newMousePoint.map((v, i) => v - mousePoint[i]) as Vec2
        mousePoint = newMousePoint
        cameraFront = normalize(
          vec3(...(mult(rotateY(ROTATE_PER_X_FPV * translateVector[0]),
            vec4(...cameraFront, 1)) as Vec4)
            .slice(0, 3)), false) as Vec3
        let initZ = Math.sqrt(cameraFront[0] * cameraFront[0] + cameraFront[2] * cameraFront[2])
        let tempVec = vec4(0, cameraFront[1], initZ, 1)
        tempVec = mult(rotateX(ROTATE_PER_Y_FPV * translateVector[1]), tempVec) as Vec4
        if (tempVec[1] > VEC_UP_MAX[1] && tempVec[2] >= 0 || tempVec[1] > 0 && tempVec[2] < 0) {
          tempVec = VEC_UP_MAX
        } else if (tempVec[1] < VEC_DOWN_MAX[1] && tempVec[2] >= 0 || tempVec[1] < 0 && tempVec[2] < 0) {
          tempVec = VEC_DOWN_MAX
        }
        let newZ = tempVec[2]
        cameraFront = vec3(cameraFront[0] * newZ / initZ, tempVec[1], cameraFront[2] * newZ / initZ)
        reRender(ctm, true, true)
      }
    }
    // 如果想要不按住也可以鼠标观察，则注释下列钩子
    canvasDOM.onmouseup = () => {
      canvasDOM.onmousemove = () => { }
    }
  }
  // 键盘侦听
  let isKeyDown: { [key: string]: boolean } = {
    '87'/*W*/: false,
    '65'/*A*/: false,
    '83'/*S*/: false,
    '68'/*D*/: false,
    '32'/*Space*/: false,
    '16'/*Shift*/: false
  }
  let listenKeyboardFPV = () => {
    isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false
    window.onkeydown = (e: KeyboardEvent) => {
      if (e && e.keyCode) {
        isKeyDown[e.keyCode] = true
        if (cameraMoveId == 0) {
          cameraMoveId = window.setInterval(moveCamera, INTERVAL)
        }
      }
    }
    window.onkeyup = (e: KeyboardEvent) => {
      if (e && e.keyCode) {
        isKeyDown[e.keyCode] = false
      }
    }
  }
  let moveCamera = () => {
    let cameraMoveSpeed = vec3(0, 0, 0)
    let frontVec = normalize(vec3(cameraFront[0], 0, cameraFront[2]), false)
    let leftVec = normalize(cross(VEC_Y, cameraFront), false)
    let moveFlag = false
    if (isKeyDown['87'/*W*/]) {
      cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), frontVec)) as Vec3
      moveFlag = true
    }
    if (isKeyDown['83'/*S*/]) {
      cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), frontVec)) as Vec3
      moveFlag = true
    }
    if (isKeyDown['65'/*A*/]) {
      cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), leftVec)) as Vec3
      moveFlag = true
    }
    if (isKeyDown['68'/*D*/]) {
      cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), leftVec)) as Vec3
      moveFlag = true
    }
    if (isKeyDown['32'/*Space*/]) {
      cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), VEC_Y)) as Vec3
      moveFlag = true
    }
    if (isKeyDown['16'/*Shift*/]) {
      cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), VEC_Y)) as Vec3
      moveFlag = true
    }
    if (!moveFlag) {
      clearInterval(cameraMoveId)
      cameraMoveId = 0
      return
    }
    cameraPos = add(cameraPos, cameraMoveSpeed) as Vec3
    reRender(ctm)
  }


  // do it
  main()
