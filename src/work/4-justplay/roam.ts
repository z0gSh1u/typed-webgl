// ==================================
// 第一人称漫游实现
// by LongChen
// ==================================

import '../../3rd-party/MV'
import { waveSword } from './sword'
import { MagicCubeActBox } from './magicCube'
import { performNewIsland } from './newIsland'
import { blocks } from './blocks'

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
const GRAVITY = -0.02 // 重力加速度
const GETUP_SPEED = 0.1 // 起身速度
const HEAD_SIZE = 0.2 // 
const BODY_WIDTH = 0.18 // 
const STAND_HEIGHT = 0.5 // 
const SQUAT_HEIGHT = 0.2 // 
let legHeight = STAND_HEIGHT // 
const JUMP_SPEED = 0.2 // 起跳速度
let isOnFloor = false // 是否站在地板上
let isGettingUp = false // 是否正在起身
let verticalSpeed = 0 // 垂直方向速度，主要用于跳跃
const actDistance = 0.32 // 最远互动距离
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
  canvasDOM.onmouseup = () => {
    waveSword()
    // 如果想要不按住也可以鼠标观察，则注释下列钩子
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
  '16'/*Shift*/: false,
  '69'/*E*/: false
}
let listenKeyboardFPV = () => {
  if (cameraMoveId == 0) {
    cameraMoveId = window.setInterval(moveCamera, INTERVAL)
  }
  isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false
  window.onkeydown = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      if(e.keyCode == 69 && !isKeyDown['69'] && isActing(MagicCubeActBox)){
        launchNewIsland()
      }
      isKeyDown[e.keyCode] = true
    }
  }
  window.onkeyup = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      isKeyDown[e.keyCode] = false
    }
  }
}

//判断互动时镜头朝向与距离是否正确
let isActing = (actBox: Vec3[]) => {
  let lookat = cameraFront
  lookat = lookat.map((v) => {return actDistance * v}) as Vec3
  lookat = add(lookat, cameraPos) as Vec3
  let res = cameraPos.map((v, i) => {return v >= actBox[0][i] && v <= actBox[1][i]})
  if(res[0] && res[1] && res[2]){
    return true
  }
  res = lookat.map((v, i) => {return v >= actBox[0][i] && v <= actBox[1][i]})
  if(res[0] && res[1] && res[2]){
    return true
  }
  return false
}

//判断当前位置是否在障碍物内
let isInBlock = (block: Vec3[], pos: Vec3) => {
  return block[0][0] < pos[0] && block[1][0] > pos[0] && block[0][2] < pos[2] && block[1][2] > pos[2] && block[0][1] < pos[1] && block[1][1] > pos[1]
}
//判断是否站在某个障碍物商
let isOnBlock = (block: Vec3[]) => {
  return block[0][0] < cameraPos[0] && block[1][0] > cameraPos[0] && block[0][2] < cameraPos[2] && block[1][2] > cameraPos[2] && block[1][1] == cameraPos[1]
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
      isOnFloor = false
    }
  }
  if (isKeyDown['16'/*Shift*/]) {
    legHeight = SQUAT_HEIGHT
  } else {
    if (legHeight == SQUAT_HEIGHT) {
      isGettingUp = true
    }
    legHeight = STAND_HEIGHT
  }
  let vBlocks = blocks.map((v) => {return [add(v[0], vec3(-BODY_WIDTH, -HEAD_SIZE, -BODY_WIDTH)) as Vec3, add(v[1], vec3(BODY_WIDTH, legHeight, BODY_WIDTH)) as Vec3]})
  if (!isOnFloor) {
    verticalSpeed += GRAVITY
  } else {
    verticalSpeed = Math.max(0, verticalSpeed)
  }
  cameraMoveSpeed[1] += verticalSpeed
  let lastPos = cameraPos
  cameraPos = add(cameraPos, cameraMoveSpeed) as Vec3
  let isIn = vBlocks.map((v) => {return isInBlock(v, cameraPos)})
  if (isGettingUp) {
    vBlocks.map((v, i) => {
      if(isIn[i]) {
        cameraPos[1] = Math.min(cameraPos[1] + GETUP_SPEED, v[1][1])
        if(cameraPos[1] == v[1][1]) {
          isGettingUp = false
          isIn[i] = false
        }
      }
    })
  }
  if (cameraPos[1] < lastPos[1]) {
    vBlocks.map((v, i) => {
      if(isIn[i]) {
        if (lastPos[1] >= v[1][1]) {
          cameraPos[1] = v[1][1]
          isIn[i] = false
          isGettingUp = false
          isOnFloor = true
        }
        if (v[1][1] - cameraPos[1] <= GETUP_SPEED) {
          cameraPos[1] = v[1][1]
          isIn[i] = false
          isGettingUp = false
          isOnFloor = true
        }
      }
    })
  } else if (cameraPos[1] > lastPos[1]){
    vBlocks.map((v, i) => {
      if (isIn[i]) {
        if (lastPos[1] <= v[0][1]) {
          cameraPos[1] = v[0][1]
          isIn[i] = false
          verticalSpeed = 0
        } else if (v[1][1] - cameraPos[1] <= GETUP_SPEED) {
          cameraPos[1] = v[1][1]
          isIn[i] = false
          isGettingUp = false
          isOnFloor = true
        }
      } else {
        
      }
    })
  }
  if (cameraPos[0] < lastPos[0]) {
    vBlocks.map((v, i) => {
      if (isIn[i]) {
        if (lastPos[0] >= v[1][0]) {
          cameraPos[0] = v[1][0]
          isIn[i] = false
        }
      }
    })
  } else if (cameraPos[0] > lastPos[0]){
    vBlocks.map((v, i) => {
      if (isIn[i]) {
        if (lastPos[0] <= v[0][0]) {
          cameraPos[0] = v[0][0]
          isIn[i] = false
        }
      }
    })
  }
  if (cameraPos[2] < lastPos[2]) {
    vBlocks.map((v, i) => {
      if (isIn[i]) {
        if (lastPos[2] >= v[1][2]) {
          cameraPos[2] = v[1][2]
          isIn[i] = false
        }
      }
    })
  } else if (cameraPos[2] > lastPos[2]){
    vBlocks.map((v, i) => {
      if (isIn[i]) {
        if (lastPos[2] <= v[0][2]) {
          cameraPos[2] = v[0][2]
          isIn[i] = false
        }
      }
    })
  }
  let flag = false
  vBlocks.map((v, i) => {
    if(isOnBlock(v)) {
      flag = true
      isOnFloor = true
      isGettingUp = false
    } else if(isIn[i]) {
      flag = true
      isOnFloor = true
    }
  })
  if(!flag) {
    isOnFloor = false
  }
}

//启动新宝岛的代码写在这里
let launchNewIsland = () => {
  performNewIsland()
  // alert("久等了")
}

export function forceSetCamera(pos: Vec3, front: Vec3) {
  cameraPos = pos; cameraFront = front
}

// ==================================
// 透视
// ==================================
const fovy = 90
const aspect = -16 / 9
const near = 0.05
const far = 2.8 // 越小越好（房间就显得越大），经过精密的调试，这个参数最棒
export const preCalculatedCPM = perspective(fovy, aspect, near, far)