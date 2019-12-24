// ==================================
// 新宝岛相关功能
// by z0gSh1u
// ==================================

import { getLookAt, cameraPos, cameraFront, forceSetCamera, VEC_Y } from "./roam"
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

function smoothUpDown(from: Vec3, to: Vec3, eye: Vec3, msPeriod: number = 50) {
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

let PonyRandomMove = (msPeriod: number = 50) => {
  let moveSequence: Array<Mat> = [
    translate(0.05, 0, 0),
    translate(0.05, 0, 0),
    translate(0.05, 0, 0),
    translate(0.05, 0, 0),

  ], p = 0, len = moveSequence.length
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

export async function performNewIsland() {
  // 放音乐
  await playNewIsland()
  // 振动
  startShakingCTM()
  // 模拟抖动3200ms
  await mySetTimeout(() => { stopShakingCTM() }, 3200)
  // 变色剑
  window.setInterval(() => { changeSwordColorTo(colorList[colorPointer]); colorPointer += 1; colorPointer %= 3 }, 200)
  // 机位行动
  forceSetCamera(...cameraPosition['lookPony'])
  // 等待1秒
  await mySetTimeout(() => { }, 1000)
  // 远近拉一次
  await smoothZoom(cameraPosition['lookPony'][0], cameraPosition['nearPony'][0], cameraPosition['lookPony'][1])
  await mySetTimeout(() => { }, 200)
  await smoothZoom(cameraPosition['nearPony'][0], cameraPosition['lookPony'][0], cameraPosition['lookPony'][1])
  await smoothUpDown(cameraPosition['lookPony'][1], cameraPosition['lookUp'][1], cameraPosition['lookPony'][0])
  await smoothUpDown(cameraPosition['lookPony'][1], cameraPosition['lookUp'][1], cameraPosition['lookPony'][0])
  await PonyRandomMove()
}

let cameraPosition: { [key: string]: [Vec3, Vec3] } = {
  'lookPony': [
    vec3(0.521367, -0.5, -0.362234), // at
    vec3(0.3738316, -0.026115, 0.927129) // front
  ],
  'nearPony': [
    vec3(0.45905, -0.5, -0.05723),
    vec3(0.3738316, -0.026115, 0.927129)
  ],
  'lookUp': [
    vec3(0.521367, -0.5, -0.362234), // at
    vec3(0.4891365, 0.481753, 0.727089) // front
  ],
  'lookDown': [
    vec3(0.521367, -0.5, -0.362234), // at
    vec3(0.4891365, 0.481753, 0.727089) // front
  ],
}