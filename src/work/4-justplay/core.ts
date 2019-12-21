// Core code of 4-JustPlay.
// by z0gSh1u
import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { initSkyBox, renderSkyBox } from './skybox'
import { enableRoaming, preCalculatedCPM, getLookAt } from './roam'
import { initPony, renderPony, PonyModifyLightBuldPosition } from './pony'
import { initTF, renderTF, stepTFStatus } from './textureField'
import { startLightBulbAutoRotate, getLightBulbPosition } from './light'
import { initSword, renderSword, SwordModifyLightBulbPosition, SwordMaterial } from './sword'
import { initMagicCube, renderMagicCube } from './magicCube'
import { playNewIsland } from './extra'

// ==================================
// 主要变量
// ==================================
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = {
  SKYBOX: 0, PONY: 1, SWORD: 2, CUBE: 3
}

let lightBulbPosition = vec3(0.5, 0.5, 0.0) // 光源位置

// 材质分配
/**
 * 0~5：天空盒，其中5为纹理场
 * 6~14：小马
 * 20
 */

let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/SkyBox.glslv', './shader/SkyBox.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Pony.glslv', './shader/Pony.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Sword.glslv', './shader/Sword.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Cube.glslv', './shader/Cube.glslf'),

  ])
  gl.enable(gl.DEPTH_TEST)

  await initSkyBox(helper, PROGRAMS.SKYBOX)
  await initPony(helper, lightBulbPosition, PROGRAMS.PONY)
  await initTF(helper, PROGRAMS.SKYBOX)
  await initSword(helper, lightBulbPosition, PROGRAMS.SWORD)
  initMagicCube(canvasDOM, helper, PROGRAMS.CUBE)

  enableRoaming(canvasDOM)
  startLightBulbAutoRotate(100)

  // 纹理场行动
  window.setInterval(() => {
    stepTFStatus()
  }, 100)
  requestAnimationFrame(reRender)

  // startShake()
  // playNewIsland()
}

(document.querySelector('#btn_playNewIsland') as HTMLButtonElement).onclick = async () => {

  // todo:

  await playNewIsland()
  startShake()

  window.setTimeout(() => {
    startShake()
    SwordMaterial.diffuseMaterial = WebGLUtils.normalize8bitColor([255, 0, 0])
    SwordMaterial.ambientMaterial = WebGLUtils.normalize8bitColor([255, 0, 0])
    SwordMaterial.reCalculateProducts()
    window.setTimeout(() => {
      SwordMaterial.diffuseMaterial = WebGLUtils.normalize8bitColor([0, 255, 0])
      SwordMaterial.ambientMaterial = WebGLUtils.normalize8bitColor([0, 255, 0])
      SwordMaterial.reCalculateProducts()
    }, 5000)
  }, 2000)

}

let theta = 0

let shakeCTM = false

let wrappedGetLookAt = () => {
  if (!shakeCTM) {
    return getLookAt()
  }
  let tmp = getLookAt()
  let x = (Math.random() - 0.5) / 30
  let y = (Math.random() - 0.5) / 30
  let z = (Math.random() - 0.5) / 30
  return mult(translate(x, y, z), tmp) as Mat
}

let startShake = () => {
  shakeCTM = !shakeCTM
}

// 全局统一重新渲染
let reRender = () => {
  PonyModifyLightBuldPosition(getLightBulbPosition())
  SwordModifyLightBulbPosition(getLightBulbPosition())
  renderPony(helper, wrappedGetLookAt(), preCalculatedCPM, PROGRAMS.PONY)
  renderSkyBox(helper, wrappedGetLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderTF(helper, wrappedGetLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderSword(helper, wrappedGetLookAt(), PROGRAMS.SWORD)
  renderMagicCube(helper, PROGRAMS.CUBE, theta)
  theta = (theta + 2) % 360
  requestAnimationFrame(reRender)
}

main()
