// ==================================
// 纹理场实现
// by z0gSh1u
// ==================================

import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";
import { loadImageAsync } from "../../framework/WebGLUtils";

let TFVBuffer: WebGLBuffer
let TFTBuffer: WebGLBuffer

export async function initTF(helper: WebGLHelper3d, skyBoxProgram: number) {
  TFVBuffer = helper.createBuffer()
  TFTBuffer = helper.createBuffer()
  helper.switchProgram(skyBoxProgram)
  helper.sendTextureImageToGPU(await loadImageAsync([
    './model/texture/SkyBox/front.png',
  ]), 5, 6) // 5 texture
}

const n = 1.0
let frontCoord = [
  [-n, -n, 1.0], [n, -n, 1.0],
  [n, n, 1.0], [-n, n, 1.0]
]
const part = 0.33
let texCoords = [
  [0.0, 0.0], [part, 0.0],
  [part, part], [0.0, part]
]
const STEP = 0.04
let currentLine = 0
let currentX = 0, currentY = 0 // 都是起点，一个part*part方块

export function stepTFStatus() {
  currentX += STEP
  if (currentX >= 1) { // 换行
    currentX = 0
    currentLine = (currentLine + 1) % 3
  }
  currentY = currentLine * part
  texCoords = [
    [currentX, currentY], [currentX + part, currentY],
    [currentX + part, currentY + part], [currentX, currentY + part],
  ]
}

export function renderTF(helper: WebGLHelper3d, lookAt: Mat, perspectiveMat: Mat, skyBoxProgram: number) {
  helper.switchProgram(skyBoxProgram)
  let gl = helper.glContext
  helper.prepare({
    attributes: [
      { buffer: TFVBuffer, data: flatten(frontCoord), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
      { buffer: TFTBuffer, data: flatten(texCoords), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT }
    ],
    uniforms: [
      { varName: 'uTexture', data: 5, method: '1i' },
      { varName: 'uPerspectiveMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
      { varName: 'uWorldMatrix', data: flatten(lookAt), method: 'Matrix4fv' }
    ]
  })
  helper.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}