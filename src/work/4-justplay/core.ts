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

// ==================================
// 主要变量
// ==================================
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = {
  SKYBOX: 0, PONY: 1, LAPPLAND: 2
}

let lightBulbPosition = vec3(0.5, 0.5, 0.0) // 光源位置

// 材质分配
/**
 * 0~5：天空盒，其中5为纹理场
 * 6~14：小马
 */

let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/SkyBox.glslv', './shader/SkyBox.glslf'),
    WebGLUtils.initializeShaders(gl, './shader/Pony.glslv', './shader/Pony.glslf'),

  ])
  gl.enable(gl.DEPTH_TEST)

  await initSkyBox(helper, PROGRAMS.SKYBOX)
  await initPony(helper, lightBulbPosition, PROGRAMS.PONY)
  await initTF(helper, PROGRAMS.SKYBOX)
  enableRoaming(canvasDOM)
  startLightBulbAutoRotate(100)

  // 纹理场行动
  window.setInterval(() => {
    stepTFStatus()
  }, 150)

  // 全局统一重新渲染
  window.setInterval(() => {
    reRender()
  }, 30) // 60 fps

}


// 全局统一重新渲染
let reRender = () => {
  PonyModifyLightBuldPosition(getLightBulbPosition())
  renderPony(helper, getLookAt(), preCalculatedCPM, PROGRAMS.PONY)
  renderSkyBox(helper, getLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
  renderTF(helper, getLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
}

main()