// ==================================
// 第一人称漫游实现
// by LongChen
// ==================================

import '../../3rd-party/MV'
import { waveSword } from './sword'

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
const POS_MIN = vec3(-0.82, 0, -0.82)// 相机位置边界，分别为XZ坐标的最小值，第二个分量无效
const POS_MAX = vec3(0.82, 0, 0.82)// 相机位置边界，分别为XZ坐标的最大值，第二个分量无效
const GRAVITY = -0.02 // 重力加速度
const GETUP_SPEED = 0.1 // 起身速度
const CEIL = 0.8 // 天花板坐标
const FLOOR_STAND = -0.5 // 站立时地板坐标
const FLOOR_SQUAT = -0.8 // 蹲下时地板坐标
const JUMP_SPEED = 0.15 // 起跳速度
let floor = FLOOR_STAND // 相机Y坐标最小值，可变以实现下蹲
let isOnFloor = false // 是否站在地板上
let verticalSpeed = 0 // 垂直方向速度，主要用于跳跃
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
    waveSword()
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
  if (cameraMoveId == 0) {
    cameraMoveId = window.setInterval(moveCamera, INTERVAL)
  }
  isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false
  window.onkeydown = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      isKeyDown[e.keyCode] = true
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
  if (isKeyDown['87'/*W*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), frontVec)) as Vec3
  }
  if (isKeyDown['83'/*S*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), frontVec)) as Vec3
  }
  if (isKeyDown['65'/*A*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), leftVec)) as Vec3
  }
  if (isKeyDown['68'/*D*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), leftVec)) as Vec3
  }
  if (isKeyDown['32'/*Space*/]) {
    if (isOnFloor) {
      verticalSpeed = JUMP_SPEED
    }
  }
  if (isKeyDown['16'/*Shift*/]) {
    floor = FLOOR_SQUAT
  } else {
    floor = FLOOR_STAND
  }
  if (!isOnFloor) {
    verticalSpeed += GRAVITY
  }
  cameraMoveSpeed[1] += verticalSpeed
  cameraPos = add(cameraPos, cameraMoveSpeed) as Vec3
  if (!isOnFloor && cameraPos[1] > CEIL) {
    cameraPos[1] = CEIL
    verticalSpeed = 0
  }
  if (!isOnFloor && cameraPos[1] <= floor) {
    cameraPos[1] = floor
    verticalSpeed = 0
    isOnFloor = true
  }
  if (isOnFloor && cameraPos[1] < floor) {
    cameraPos[1] = Math.min(cameraPos[1] + GETUP_SPEED, floor)
  }
  if (cameraPos[1] > floor) {
    isOnFloor = false
  }
  // 简单粗暴的水平方向空气墙实现
  [0, 2].forEach(v => {
    cameraPos[v] = Math.min(cameraPos[v], POS_MAX[v])
    cameraPos[v] = Math.max(cameraPos[v], POS_MIN[v])
  })
}

// ==================================
// 透视
// ==================================
const fovy = 119
const aspect = -16 / 9
const near = 0.05
const far = 2.8 // 越小越好（房间就显得越大），经过精密的调试，这个参数最棒
export const preCalculatedCPM = perspective(fovy, aspect, near, far)