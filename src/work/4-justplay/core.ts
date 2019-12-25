// Core code of 4-JustPlay.
// by z0gSh1u, LongChen and Twi.

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { initSkyBox, renderSkyBox } from './skybox'
import { enableRoaming, preCalculatedCPM, getLookAt, cameraPos, cameraFront } from './roam'
import { initPony, renderPony, PonyModifyLightBuldPosition } from './pony'
import { initTF, renderTF, stepTFStatus } from './textureField'
import { startLightBulbAutoRotate, getLightBulbPosition } from './light'
import { initSword, renderSword, SwordModifyLightBulbPosition, SwordMaterial } from './sword'
import { initMagicCube, renderMagicCube, startMagicCubeAutoRotate } from './magicCube'
import { playNewIsland, shakedCTM, wrappedGetLookAt, performNewIsland } from './newIsland'

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

let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/SkyBox.glslv', './shader/SkyBox.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Pony.glslv', './shader/Pony.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Sword.glslv', './shader/Sword.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Cube.glslv', './shader/Cube.glslf'),
  ])
  gl.enable(gl.DEPTH_TEST)
  // 初始化各个部件
  await initSkyBox(helper, PROGRAMS.SKYBOX)
  await initPony(helper, lightBulbPosition, PROGRAMS.PONY)
  await initTF(helper, PROGRAMS.SKYBOX)
  await initSword(helper, lightBulbPosition, PROGRAMS.SWORD)
  await initMagicCube(canvasDOM, helper, PROGRAMS.CUBE)
  // FPV漫游
  enableRoaming(canvasDOM)
  // 自动旋转光源
  startLightBulbAutoRotate(50)
  startMagicCubeAutoRotate(50)
  // 纹理场行动
  window.setInterval(() => {
    stepTFStatus()
  }, 100);
  
  (document.querySelector('#btn_playNewIsland') as HTMLButtonElement).onclick = () => {
    performNewIsland()
  }
  (document.querySelector('#btn_getCamera') as HTMLButtonElement).onclick = () => {
    let s = "Pos = " + cameraPos + "\nFront = " + cameraFront + "\nLookAt = " + add(cameraPos, cameraFront)
    alert(s)
  }

  
  // 全局重渲染
  requestAnimationFrame(reRender)
}

// 全局统一重新渲染
let reRender = () => {
  PonyModifyLightBuldPosition(getLightBulbPosition())
  SwordModifyLightBulbPosition(getLightBulbPosition())
  renderPony(helper, wrappedGetLookAt(), preCalculatedCPM, PROGRAMS.PONY)
  renderSkyBox(helper, wrappedGetLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderTF(helper, wrappedGetLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderSword(helper, wrappedGetLookAt(), PROGRAMS.SWORD)
  renderMagicCube(helper, preCalculatedCPM, PROGRAMS.CUBE)
  requestAnimationFrame(reRender)
}

// Just play!
main()

// ==========材质分配==========
// 0~5：天空盒，其中5为纹理场
// 6~14：小马
// 20: CubeMap
// ===========================