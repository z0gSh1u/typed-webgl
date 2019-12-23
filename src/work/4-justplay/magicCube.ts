// ==================================
// 魔法方块（环境反射）
// by z0gSh1u, LongChen, Twi
// ==================================

import { getLookAt, cameraPos, cameraFront } from "./roam";
import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";
import { loadImageAsync } from "../../framework/WebGLUtils";

let vBuffer: WebGLBuffer
let nBuffer: WebGLBuffer
let texture: WebGLTexture
export let MagicCubeModelMat: Mat

export async function initMagicCube(canvasDOM: HTMLCanvasElement, helper: WebGLHelper3d, magicCubeProgram: number) {
  helper.switchProgram(magicCubeProgram)
  let gl = helper.glContext
  vBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()
  MagicCubeModelMat = translate(0, -0.5, 0.2)
  MagicCubeModelMat = mult(rotateX(45), MagicCubeModelMat) as Mat

  let texture = gl.createTexture() as WebGLTexture
  helper.sendCubeMapTextureToGPU((await loadImageAsync(['./model/texture/Cube/X+.png']))[0], texture, '+x')
  helper.sendCubeMapTextureToGPU((await loadImageAsync(['./model/texture/Cube/X-.png']))[0], texture, '-x')
  helper.sendCubeMapTextureToGPU((await loadImageAsync(['./model/texture/Cube/Y+.png']))[0], texture, '+y')
  helper.sendCubeMapTextureToGPU((await loadImageAsync(['./model/texture/Cube/Y-.png']))[0], texture, '-y')
  helper.sendCubeMapTextureToGPU((await loadImageAsync(['./model/texture/Cube/Z+.png']))[0], texture, '+z')
  helper.sendCubeMapTextureToGPU((await loadImageAsync(['./model/texture/Cube/Z-.png']))[0], texture, '-z')

  helper.postProcessCubeMapTexture()
}

export function renderMagicCube(helper: WebGLHelper3d, perspectiveMat: Mat, programIndex: number) {
  helper.switchProgram(programIndex)
  let gl = helper.glContext
  helper.prepare({
    attributes: [
      { buffer: vBuffer, data: positions, varName: 'aPoition', attrPer: 3, type: gl.FLOAT },
      { buffer: nBuffer, data: normals, varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
    ],
    uniforms: [
      { varName: 'texMap', data: 20, method: '1i' },
      { varName: 'uWorldMatrix', data: flatten(getLookAt()), method: 'Matrix4fv' },
      { varName: 'uModelMatrix', data: flatten(MagicCubeModelMat), method: 'Matrix4fv' },
      { varName: 'uProjectionMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
      { varName: 'uModelInvTransMatrix', data: flatten(transpose(inverse(MagicCubeModelMat))), method: 'Matrix4fv' },
      { varName: 'uSightLine', data: add(cameraPos, cameraFront), method: '3fv' }
    ]
  })
  helper.drawArrays(gl.TRIANGLES, 0, 6 * 6)
}

export function startMagicCubeAutoRotate(msPeriod: number) {
  window.setInterval(() => {
    MagicCubeModelMat = mult(MagicCubeModelMat, rotateY(3)) as Mat
  }, msPeriod)
}

// 坐标信息
const n = 0.15
let positions = new Float32Array([
  -n, -n, -n, -n, n, -n, n, -n, -n, -n, n, -n,
  n, n, -n, n, -n, -n, -n, -n, n, n, -n, n,
  -n, n, n, -n, n, n, n, -n, n, n, n, n,
  -n, n, -n, -n, n, n, n, n, -n, -n, n, n,
  n, n, n, n, n, -n, -n, -n, -n, n, -n, -n,
  -n, -n, n, -n, -n, n, n, -n, -n, n, -n, n,
  -n, -n, -n, -n, -n, n, -n, n, -n, -n, -n, n,
  -n, n, n, -n, n, -n, n, -n, -n, n, n, -n,
  n, -n, n, n, -n, n, n, n, -n, n, n, n,
])
let normals = new Float32Array([
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1,
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0,
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
])
