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
import { initSword, renderSword, SwordModifyLightBulbPosition } from './sword'
import { initMagicCube, renderMagicCube } from './magicCube'

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
}

let theta = 0

// 全局统一重新渲染
let reRender = () => {
  PonyModifyLightBuldPosition(getLightBulbPosition())
  SwordModifyLightBulbPosition(getLightBulbPosition())
  renderPony(helper, getLookAt(), preCalculatedCPM, PROGRAMS.PONY)
  renderSkyBox(helper, getLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderTF(helper, getLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderSword(helper, getLookAt(), PROGRAMS.SWORD)
  // renderMagicCube(helper, PROGRAMS.CUBE, theta)
  theta = (theta + 2) % 360
  requestAnimationFrame(reRender)
}

main()
