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
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl', { alpha: true, premultipliedAlpha: false }) as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = { MAIN: 0, BACKGROUND: 1, BALL: 2 }
let MODES = { TRACKBALL: 0, FPV: 1, LIGHT: 2 }
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
let HairMaterial = new PhongLightModel({ // 头发光照参数
  lightPosition: lightBulbPosition,
  ambientColor: [64, 200, 200],
  ambientMaterial: [100, 100, 100],
  diffuseColor: [64, 200, 200],
  diffuseMaterial: [255, 255, 255],
  specularColor: [64, 200, 200],
  specularMaterial: [10, 10, 10],
  materialShiness: 80.0
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
let Ball: DrawingPackage3d
let ballVBuffer: WebGLBuffer
let lastLightBulbPosition = vec3(0.0, 0.0, 0.0)
const LIGHT_TRANSLATE_FACTOR = 0.00005
const LIGHT_Z_PLUS = 0.015
// ==================================
// 透视使用
// ==================================
let cpm: Mat
let fovy = 45.0
let aspect = -1.0
let near = 0.1
let far = 5.0
let preCalculatedCPM = perspective(fovy, aspect, near, far)
// ==================================
// 观察相机使用
// !! 请注意，pos->at与pos->up不能共线 !!
// ==================================
const ROTATE_PER_Y_FPV = 0.05
const ROTATE_PER_X_FPV = 0.05
let cameraPos = vec3(0.0, 0.4, -3.0)
let camearaFront = vec3(0.0, 0.0, 1.0)
let cameraUp = vec3(0.0, 1.0, 0.0)
let cameraPosSpeed = vec3(0.0, 0.0, 0.0)
let cameraMoveSpeed = 0.02
let cameraMoveId: number = 0// 相机移动计时器编号
// ==================================
// 跟踪球使用
// ==================================
const FRICTION = 0.0006 // 模拟摩擦力，每毫秒降低的速度
const INTERVAL = 40 // 速度降低的毫秒间隔
const ROTATE_PER_X = 0.5 // X轴鼠标拖动旋转的比例
const ROTATE_PER_Y = 0.5 // Y轴鼠标拖动旋转的比例
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
let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/vMain.glsl', './shader/fMain.glsl'),
    WebGLUtils.initializeShaders(gl, './shader/vBackground.glsl', './shader/fBackground.glsl'),
    WebGLUtils.initializeShaders(gl, './shader/vBall.glsl', './shader/fBall.glsl'),
  ])
  gl.enable(gl.DEPTH_TEST)
  // 初始化各buffer
  vBuffer = helper.createBuffer()
  tBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()
  bgVBuffer = helper.createBuffer()
  bgTBuffer = helper.createBuffer()
  ballVBuffer = helper.createBuffer()
  ctm = mat4()
  cpm = mat4()
  await startSceneInit()
}
// 必须使用该函数修改前端光照位置
let modifyLightBulbPosition = (newPos: Vec3) => {
  lastLightBulbPosition = lightBulbPosition
  lightBulbPosition = newPos
  initPositionInput()
}
// 场景初始化
let startSceneInit = async () => {
  // 初始化背景图，分配9号纹理
  helper.sendTextureImageToGPU(await WebGLUtils.loadImageAsync(['./model/bg.png']), 9, 10)
  // 设定光球模型
  Ball = new DrawingPackage3d(WebGLUtils.scaleMat(0.5, 0.5, 0.5), ...[
    new DrawingObject3d('ball', './model/normed/ball.obj')
  ])
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
// 重绘MAIN
let reRenderMain = (ctm: Mat) => {
  helper.switchProgram(PROGRAMS.MAIN)
  helper.prepare({
    attributes: [],
    uniforms: [
      { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
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
    if (obj.name != 'hairBack' && obj.name != 'hairFront') {
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
    }
  })
  // 单独处理头发材质
  helper.prepare({
    attributes: [],
    uniforms: [
      { varName: 'uShiness', data: HairMaterial.materialShiness, method: '1f' },
      { varName: 'uAmbientProduct', data: HairMaterial.ambientProduct, method: '4fv' },
      { varName: 'uDiffuseProduct', data: HairMaterial.diffuseProduct, method: '4fv' },
      { varName: 'uSpecularProduct', data: HairMaterial.specularProduct, method: '4fv' },
    ]
  });
  [Pony.getObjectByName('hairFront') as DrawingObject3d, Pony.getObjectByName('hairBack') as DrawingObject3d].forEach(obj => {
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
let reRenderLightBall = (posChanged: boolean = false) => {
  helper.switchProgram(PROGRAMS.BALL)
  if (posChanged) {
    Ball.setModelMat(mult(Ball.modelMat, translate(
      lightBulbPosition[0] - lastLightBulbPosition[0],
      lightBulbPosition[1] - lastLightBulbPosition[1],
      lightBulbPosition[2] - lastLightBulbPosition[2],
    )) as Mat)
  }
  Ball.innerList.forEach(obj => {
    let vs = helper.analyzeFtoV(obj, 'fs')
    helper.prepare({
      attributes: [
        { buffer: ballVBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT }
      ],
      uniforms: [
        { varName: 'uColor', data: WebGLUtils.normalize8bitColor([255, 181, 41]), method: '4fv' },
        { varName: 'uWorldMat', data: flatten(ctm), method: 'Matrix4fv' },
        { varName: 'uModelMat', data: flatten(Ball.modelMat), method: 'Matrix4fv' },
      ]
    })
    helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())
  })
}
// reRender
let reRender = (ctm: Mat, reCalulateMaterialProducts: boolean = false, lightPosChanged: boolean = false) => {
  reCalulateMaterialProducts && PonyMaterial.reCalculateProducts() && HairMaterial.reCalculateProducts()
  // ctm = lookAt(cameraPos, add(cameraPos, camearaFront) as Vec3, camearaUp)
  if (currentMode == MODES.FPV) {
    cpm = preCalculatedCPM
    ctm = lookAt(cameraPos, add(cameraPos, camearaFront) as Vec3, cameraUp)
  } else {
    cpm = mat4()
  }
  reRenderLightBall(lightPosChanged)
  reRenderBackground()
  reRenderMain(ctm)
}
// ==================================
// 光源交互相关
// ==================================
// 初始化位置输入框
let initPositionInput = () => {
  (document.querySelector('#lightPosX') as HTMLInputElement).value = lightBulbPosition[0].toString();
  (document.querySelector('#lightPosY') as HTMLInputElement).value = lightBulbPosition[1].toString();
  (document.querySelector('#lightPosZ') as HTMLInputElement).value = (-lightBulbPosition[2]).toString()
  // 没有人知道为什么这里要加负号才是对的
}
// 调节位置
let listenPositionInput = () => {
  let positionChangedResponse = () => {
    let xx = (document.querySelector('#lightPosX') as HTMLInputElement).value,
      yy = (document.querySelector('#lightPosY') as HTMLInputElement).value,
      zz = (document.querySelector('#lightPosZ') as HTMLInputElement).value
    let res = [xx, yy, zz].map(_ => parseFloat(_))
    modifyLightBulbPosition([res[0], res[1], -res[2]])
    reRender(ctm, true, true)
  }
  (document.querySelector('#applyLightPos') as HTMLButtonElement).onclick = positionChangedResponse;
  (document.querySelector('#lightPosX') as HTMLInputElement).onclick = positionChangedResponse;
  (document.querySelector('#lightPosY') as HTMLInputElement).onclick = positionChangedResponse;
  (document.querySelector('#lightPosZ') as HTMLInputElement).onclick = positionChangedResponse
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
  // 拖动处理
  canvasDOM.onmousedown = (evt: MouseEvent) => {
    let mousePoint = [evt.offsetX, evt.offsetY] as Vec2
    canvasDOM.onmousemove = (evt2: MouseEvent) => {
      let newMousePoint = [evt2.offsetX, evt2.offsetY] as Vec2
      let translateVector = newMousePoint.map((v, i) => v - mousePoint[i]) as Vec2
      mousePoint = newMousePoint
      translateVector[0] /= canvasDOM.width; translateVector[1] /= canvasDOM.height; translateVector[1] *= -1
      translateVector.map(x => x * LIGHT_TRANSLATE_FACTOR)
      modifyLightBulbPosition([lightBulbPosition[0] + translateVector[0], lightBulbPosition[1] + translateVector[1], lightBulbPosition[2]])
      Ball.setModelMat(mult(Ball.modelMat, translate(translateVector[0], translateVector[1], 0.0)) as Mat)
      reRender(ctm, true, true)
    }
  }
  canvasDOM.onmouseup = () => {
    canvasDOM.onmousemove = () => { }
  }
  // @ts-ignore
  canvasDOM.onmousewheel = (evt: any) => {
    let dir = evt.wheelDelta > 0 ? -1 : 1 // 1 Down -1 Up
    modifyLightBulbPosition(
      [lightBulbPosition[0], lightBulbPosition[1], lightBulbPosition[2] + dir * LIGHT_Z_PLUS]
    )
    Ball.setModelMat(mult(Ball.modelMat, translate(0.0, 0.0, dir * LIGHT_Z_PLUS)) as Mat)
    reRender(ctm, true, true)
  }
}
// ==================================
// 跟踪球实现
// ==================================
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
  reRender(ctm, true, false)
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
  reRender(ctm, true, false)
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
// ==================================
// 第一人称视角实现
// ==================================
// ==================================
// 鼠标侦听
// ==================================
let listenMouseToTurnCamera = () => {
  canvasDOM.onmousedown = (evt: MouseEvent) => {
    let mousePoint = [evt.offsetX, evt.offsetY] as Vec2
    let lastTrickTick = new Date().getTime()
    let curTrickTick = lastTick
    const MIN_INTERVAL = 40
    canvasDOM.onmousemove = (evt2: MouseEvent) => {
      curTrickTick = new Date().getTime()
      if(curTrickTick - lastTrickTick < MIN_INTERVAL){
        return
      }
      lastTrickTick = curTrickTick
      let newMousePoint = [evt2.offsetX, evt2.offsetY] as Vec2
      let translateVector = newMousePoint.map((v, i) => v - mousePoint[i]) as Vec2
      mousePoint = newMousePoint
      let cfm4 = vec4(camearaFront[0], camearaFront[1], camearaFront[2], 1)
      let cum4 = vec4(cameraUp[0], cameraUp[1], cameraUp[2], 1)
      cfm4 = normalize(mult(rotateX(ROTATE_PER_X_FPV * translateVector[1]), cfm4) as Vec4, false) as Vec4
      cfm4 = normalize(mult(rotateY(ROTATE_PER_Y_FPV * translateVector[0]), cfm4) as Vec4, false) as Vec4
      cum4 = normalize(mult(rotateX(ROTATE_PER_X_FPV * translateVector[1]), cum4) as Vec4, false) as Vec4
      cum4 = normalize(mult(rotateY(ROTATE_PER_Y_FPV * translateVector[0]), cum4) as Vec4, false) as Vec4
      camearaFront = vec3(cfm4[0], cfm4[1], cfm4[2])
      cameraUp = vec3(cum4[0], cum4[1], cum4[2])
      reRender(ctm, true, true)
    }
  }
  canvasDOM.onmouseup = () => {
    canvasDOM.onmousemove = () => { }
  }
}
// ==================================
// 键盘侦听
// ==================================
let listenKeyboardFPV = () => {
  let handlers: { [key: string]: (down: boolean) => void } = {
    '87'/*W*/: processWKey,
    '65'/*A*/: processAKey,
    '83'/*S*/: processSKey,
    '68'/*D*/: processDKey,
    '32'/*Space*/: processSpace,
    '16'/*Shift*/: processShift
  }
  let isKeyDown: { [key: string]: boolean} = {
    '87'/*W*/: false,
    '65'/*A*/: false,
    '83'/*S*/: false,
    '68'/*D*/: false,
    '32'/*Space*/: false,
    '16'/*Shift*/: false
  }
  cameraPosSpeed = vec3(0, 0, 0)
  window.onkeydown = (e: KeyboardEvent) => {
    if (e && e.keyCode && !isKeyDown[e.keyCode]) {
      try {
        handlers[e.keyCode.toString()].call(null, true)
        isKeyDown[e.keyCode] = true
        if(cameraMoveId == 0){
          cameraMoveId = setInterval(moveCamera, INTERVAL)
        }
      } catch (ex) { }
    }
  }
  window.onkeyup = (e: KeyboardEvent) => {
    if (e && e.keyCode && isKeyDown[e.keyCode]) {
      try {
        handlers[e.keyCode.toString()].call(null, false)
        isKeyDown[e.keyCode] = false
        if(cameraMoveId == 0){
          cameraMoveId = setInterval(moveCamera, INTERVAL)
        }
      } catch (ex) { }
    }
  }
}
let moveCamera = () => {
  if(cameraPosSpeed == vec3(0, 0, 0)){
    clearInterval(cameraMoveId)
    cameraMoveId = 0
    return
  }
  cameraPos = add(cameraPos, cameraPosSpeed) as Vec3
  reRender(ctm)
}
let processWKey = (down: boolean) => {
  cameraPosSpeed = add(cameraPosSpeed, vec3(0, 0, (down ? 1 : -1) * cameraMoveSpeed)) as Vec3
}
let processSKey = (down: boolean) => {
  cameraPosSpeed = add(cameraPosSpeed, vec3(0, 0, (down ? -1 : 1) * cameraMoveSpeed)) as Vec3
}
let processAKey = (down: boolean) => {
  cameraPosSpeed = add(cameraPosSpeed, vec3((down ? -1 : 1) * cameraMoveSpeed, 0, 0)) as Vec3
}
let processDKey = (down: boolean) => {
  cameraPosSpeed = add(cameraPosSpeed, vec3((down ? 1 : -1) * cameraMoveSpeed, 0, 0)) as Vec3
}
let processSpace = (down: boolean) => {
  cameraPosSpeed = add(cameraPosSpeed, vec3(0, (down ? 1 : -1) * cameraMoveSpeed, 0)) as Vec3
}
let processShift = (down: boolean) => {
  cameraPosSpeed = add(cameraPosSpeed, vec3(0, (down ? -1 : 1) * cameraMoveSpeed, 0)) as Vec3
}
// ==================================
// 模式切换
// ==================================
let listenModeToggler = () => {
  (document.querySelector('#modeToggler') as HTMLButtonElement).onclick = () => {
    // 前端响应
    eval(`document.querySelector('#mode_${currentMode}').style.display = 'none'`)
    currentMode = (currentMode + 1) % 3
    eval(`document.querySelector('#mode_${currentMode}').style.display = 'inline-block'`)
    // 内部模式切换
    clearListeners()
    reRender(ctm)
    switch (currentMode) {
      case MODES.TRACKBALL: listenMouseTrackBall(); break
      case MODES.LIGHT: listenMouseLightInteract(); break
      case MODES.FPV:
        listenKeyboardFPV()
        listenMouseToTurnCamera()
        break
    }
    // 消除焦点
    (document.querySelector('#modeToggler') as HTMLButtonElement).blur()
  }
}
let clearListeners = () => {
  canvasDOM.onmousedown = () => { }
  canvasDOM.onmouseup = () => { }
  canvasDOM.onmousemove = () => { }
  // @ts-ignore
  canvasDOM.onmousewheel = () => { }
  window.onkeydown = () => { }
  window.onkeyup = () => { }
}
// do it
main()
initPositionInput()
initPonyMaterialInput()
listenPonyMaterialInput()
listenPositionInput()
listenModeToggler()
listenMouseTrackBall()
