// ==================================
// 新宝岛相关功能
// by z0gSh1u
// ==================================

import { getLookAt, cameraPos, cameraFront, forceSetCamera } from "./roam"
import { SwordMaterial } from "./sword"
import { normalize8bitColor, mySetTimeout } from "../../framework/WebGLUtils"

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
let insertSwordUponMagicCube = () => {
  // TODO: HOW?
}
let RED = vec4(1.0, 0.0, 0.0, 1.0), GREEN = vec4(0.0, 1.0, 0.0, 1.0), YELLOW = vec4(1.0, 1.0, 0.0, 1.0)
let gotoAndLookAt = (goto: Vec3, look: Vec3) => {
  forceSetCamera(goto, look)
}
let zoomIn = (howmuch: number) => {

}
let upDownWave = () => {

}
let leftRightWave = () => {

}

let colorList = [RED, GREEN, YELLOW]
let colorPointer = 0
let cameraPosition: { [key: string]: [Vec3, Vec3] } = {
  'lookPony': [
    vec3(0.521367, -0.5, -0.362234), // at
    vec3(0.39602, 0.07533, 0.91515) // front
  ]
}
export async function performNewIsland() {
  await playNewIsland()
  insertSwordUponMagicCube()
  startShakingCTM()
  await mySetTimeout(() => { stopShakingCTM() }, 3200) // 模拟抖动3200ms
  window.setInterval(() => { changeSwordColorTo(colorList[colorPointer]); colorPointer += 1; colorPointer %= 3 }, 200) // 剑持续换色
  forceSetCamera(...cameraPosition['lookPony'])
}