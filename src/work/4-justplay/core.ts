// Core code of 4-JustPlay.
// by z0gSh1u
import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'

import { DrawingObject3d } from '../../framework/3d/DrawingObject3d'
import { DrawingPackage3d } from '../../framework/3d/DrawingPackage3d'

import { initSkyBox, renderSkyBox } from './skybox'
import { enableRoaming, preCalculatedCPM, getLookAt } from './roam'
import { PhongLightModel } from '../../framework/3d/PhongLightModel'
import { initPony, renderPony } from './pony'

// ==================================
// 主要变量
// ==================================
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = {
  SKYBOX: 0, PONY: 1
}


let lightBulbPosition = vec3(0.5, 0.5, 0.0) // 光源位置

// 材质分配
/**
 * 0~5：天空盒
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
  enableRoaming(canvasDOM)

  // 全局统一重新渲染
  window.setInterval(() => { reRender() }, 30) // 33 fps
}


// 全局统一重新渲染
let reRender = () => {
  renderPony(helper, getLookAt(), preCalculatedCPM, PROGRAMS.PONY)
  renderSkyBox(helper, getLookAt(), preCalculatedCPM, PROGRAMS.SKYBOX)
}

main()