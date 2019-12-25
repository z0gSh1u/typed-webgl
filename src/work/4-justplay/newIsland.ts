// ==================================
// 新宝岛相关功能
// by z0gSh1u
// ==================================

import { getLookAt, cameraPos, cameraFront, forceSetCamera, VEC_Y, setSpaceStatus } from "./roam"
import { SwordMaterial, SwordCtm, setSwordCtm } from "./sword"
import { normalize8bitColor, mySetTimeout } from "../../framework/WebGLUtils"
import { Pony } from "./pony"

// ==================================
// 播放新宝岛
// ==================================
export function playNewIsland() {
  let audio = new Audio('./music.mp3')
  return audio.play()
}

// ==================================
// 视野抖动
// ==================================
export let isShakingCTM = false
export let shakedCTM = mat4()
let timer: number | undefined = void 233
export function wrappedGetLookAt() {
  return isShakingCTM ? shakedCTM : getLookAt()
}
let shakeCTMAtom = () => mult(translate(...[0, 0, 0].map(_ => (Math.random() - 0.5) / 30) as Vec3), getLookAt()) as Mat
let startShakingCTM = () => {
  isShakingCTM = true
  timer = window.setInterval(() => {
    shakedCTM = shakeCTMAtom()
  }, 50)
}
let stopShakingCTM = () => {
  isShakingCTM = false
  window.clearInterval(timer)
}

// ==================================
// 场景序列
// ==================================
let changeSwordColorTo = (color: Vec4) => {
  SwordMaterial.ambientMaterial = color
  SwordMaterial.diffuseMaterial = color
  SwordMaterial.reCalculateProducts()
}
let RED = vec4(1.0, 0.0, 0.0, 1.0), GREEN = vec4(0.0, 1.0, 0.0, 1.0), YELLOW = vec4(1.0, 1.0, 0.0, 1.0)
let colorList = [RED, GREEN, YELLOW]
let colorPointer = 0

function smoothZoom(from: Vec3, to: Vec3, front: Vec3, msPeriod: number = 50) {
  let points: Array<Vec3> = []
  for (let alpha = 0; alpha < 1; alpha += 0.08) {
    // 二维凸组合
    points.push(add([...from.map(_ => _ * (1 - alpha))], [...to.map(_ => _ * alpha)]) as Vec3)
  }
  let len = points.length, p = 0
  return new Promise((resolve, reject) => {
    let timer = window.setInterval(() => {
      forceSetCamera(points[p], front)
      p += 1
      if (p == len) {
        clearInterval(timer)
        resolve()
      }
    }, msPeriod)
  })
}

function smoothMove(from: Vec3, to: Vec3, eye: Vec3, msPeriod: number = 50) {
  let points: Array<Vec3> = []
  for (let alpha = 0; alpha < 1; alpha += 0.08) {
    points.push(add([...from.map(_ => _ * (1 - alpha))], [...to.map(_ => _ * alpha)]) as Vec3)
  }
  let len = points.length, p = 0
  return new Promise((resolve, reject) => {
    let timer = window.setInterval(() => {
      forceSetCamera(eye, points[p])
      p += 1
      if (p == len) {
        clearInterval(timer)
        resolve()
      }
    }, msPeriod)
  })
}

let PonyRandomMove = (moveSequence: Array<Mat>, msPeriod: number = 50) => {
  let p = 0, len = moveSequence.length
  return new Promise((resolve, reject) => {
    let timer = window.setInterval(() => {
      Pony.setModelMat(mult(Pony.modelMat, moveSequence[p]) as Mat)
      p += 1
      if (p == len) {
        clearInterval(timer)
        resolve()
      }
    }, msPeriod)
  })
}

let simulateSpacePress = async (howlong: number = 200) => {
  setSpaceStatus(true)
  await mySetTimeout(() => { setSpaceStatus(false) }, howlong)
}

export async function performNewIsland() {
  // 放音乐
  await playNewIsland()
  // 振动
  startShakingCTM()
  // 变色剑
  window.setInterval(() => { changeSwordColorTo(colorList[colorPointer]); colorPointer += 1; colorPointer %= 3 }, 200)
  // 模拟抖动3200ms
  await mySetTimeout(() => { stopShakingCTM() }, 3200)
  // 机位行动
  forceSetCamera(...cp['lookPony'])
  // 等待1秒
  await mySetTimeout(() => { }, 1000)
  // 远近拉一次
  await smoothZoom(cp['lookPony'][0], cp['nearPony'][0], cp['lookPony'][1])
  await mySetTimeout(() => { }, 200)
  await smoothZoom(cp['nearPony'][0], cp['lookPony'][0], cp['lookPony'][1])
  // ----------- 对齐线 --------------
  // 左右摇
  await smoothMove(cp['lookLeft'][1], cp['lookRight'][1], cp['lookLeft'][0])
  await smoothMove(cp['lookRight'][1], cp['lookLeft'][1], cp['lookLeft'][0])
  await smoothMove(cp['lookLeft'][1], cp['lookRight'][1], cp['lookLeft'][0])
  await smoothMove(cp['lookRight'][1], cp['lookLeft'][1], cp['lookLeft'][0])
  forceSetCamera(...cp['lookPony'])
  await mySetTimeout(() => { }, 2900) // zu ki to~~
  await PonyRandomMove(moveSequence1, 100) // sono zu ki to~
  // 跳一下
  await mySetTimeout(() => { }, 2000) // zu ki to~~  
  await simulateSpacePress()
  await mySetTimeout(() => { simulateSpacePress() }, 500) // zu ki to~~
  await mySetTimeout(() => { }, 1000)
  await PonyRandomMove(moveSequence1, 100)
  await mySetTimeout(() => { }, 300)
  await PonyRandomMove(moveSequence1, 100)
  await mySetTimeout(() => { }, 3000)
  forceSetCamera(...cp['lookUp'])
  await mySetTimeout(() => { }, 5)
  let p = 0, ms2len = moveSequence2.length
  let ms2timer = window.setInterval(() => {
    Pony.setModelMat(mult(Pony.modelMat, moveSequence2[p]) as Mat)
    p += 1; p %= ms2len
  }, 50)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 60)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 60)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 50)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 40)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 20)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 20)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 20)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 20)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 20)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)
  await smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)
  clearInterval(ms2timer)
  // Fin.
}

// 前段随机移动序列
let moveSequence1: Array<Mat> = [
  translate(0.07, 0, 0),
  translate(0.07, 0, -0.03),
  translate(-0.07, 0, 0),
  translate(0.05, 0, 0),
  translate(-0.05, 0, 0.03),
  translate(-0.05, 0, 0),
  translate(-0.05, 0, 0),
  translate(0.05, 0, 0),
]
// 高潮左右横跳序列
let moveSequence2: Array<Mat> = [
  translate(0.12, 0, 0),
  translate(0.09, 0, 0),
  translate(-0.12, 0, 0),
  translate(-0.09, 0, 0),
]

let cp: { [key: string]: [Vec3, Vec3] } = {
  'lookPony': [
    vec3(0.521367, -0.5, -0.362234), // at
    vec3(0.3738316, -0.026115, 0.927129) // front
  ],
  'nearPony': [
    vec3(0.45905, -0.5, -0.05723),
    vec3(0.3738316, -0.026115, 0.927129)
  ],
  'lookUp': [
    vec3(0.439758, -0.5, -0.2916108),
    vec3(0.1475383, 0.5806111, 0.800701)
  ],
  'lookDown': [
    vec3(0.439758, -0.5, -0.2916108),
    vec3(0.110558, -0.426309, 0.897796)
  ],
  'lookLeft': [
    vec3(0.439758, -0.5, -0.2916108),
    vec3(-0.68392, 0.1465398, 0.7146887),
  ],
  'lookRight': [
    vec3(0.439758, -0.5, -0.2916108),
    vec3(0.825318, 0.102904, 0.555212)
  ],
}