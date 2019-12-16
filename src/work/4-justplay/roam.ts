// ==================================
// 第一人称漫游实现
// by LongChen
// ==================================

import '../../3rd-party/MV'

// ==================================
// 观察相机
// ==================================
// !! 请注意，pos->at与pos->up不能共线 !!
const ROTATE_PER_Y_FPV = 0.09
const ROTATE_PER_X_FPV = 0.09
export const VEC_Y = vec3(0.0, 1.0, 0.0)
const ANGLE_UP_MAX = 120
const ANGLE_DOWN_MAX = -120
const VEC_UP_MAX = vec4(0.0, Math.sin(ANGLE_UP_MAX), Math.cos(ANGLE_UP_MAX), 1)
const VEC_DOWN_MAX = vec4(0.0, Math.sin(ANGLE_DOWN_MAX), Math.cos(ANGLE_DOWN_MAX), 1)
export let cameraPos = vec3(0.0, 0.0, 0.0)
export let cameraFront = vec3(0.1, 0.0, 0.0)
let cameraSpeed = 0.04
let cameraMoveId: number = 0 // 相机移动计时器编号
const INTERVAL = 40 // 速度降低的毫秒间隔
let lastTick: number
let canvasDOM: HTMLCanvasElement
/**
 * 开始监听鼠标键盘
 */
export function enableRoaming(_canvasDOM: HTMLCanvasElement) {
  canvasDOM = _canvasDOM
  listenMouseToTurnCamera()
  listenKeyboardFPV()
}
/**
 * 获取当前lookAt
 */
export function getLookAt() {
  return lookAt(cameraPos, add(cameraPos, cameraFront) as Vec3, VEC_Y)
}
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
      // TODO: 空气墙
      // 这种写法不对
      // if (cameraPos.some(v => Math.abs(v) >= 0.88)) {
      //   return
      // }
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
}

// ==================================
// 透视
// ==================================
const fovy = 90.0
const aspect = -16 / 9
const near = 0.05
const far = 2.8 // 越小越好（房间就显得越大），经过精密的调试，这个参数最棒
export const preCalculatedCPM = perspective(fovy, aspect, near, far)