// ==================================
// 天空盒实现
// by z0gSh1u
// ==================================

import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";
import { loadImageAsync } from "../../framework/WebGLUtils";

let SkyBoxVBuffer: WebGLBuffer
let SkyBoxTBuffer: WebGLBuffer

/**
 * 初始化天空盒，发送相关信息
 */
export async function initSkyBox(helper: WebGLHelper3d, skyBoxProgram: number) {
  SkyBoxVBuffer = helper.createBuffer()
  SkyBoxTBuffer = helper.createBuffer()
  helper.switchProgram(skyBoxProgram)
  helper.sendTextureImageToGPU(await loadImageAsync([
    './model/texture/SkyBox/back.png',
    './model/texture/SkyBox/left.png',
    './model/texture/SkyBox/right.png',
    './model/texture/SkyBox/up.png',
    './model/texture/SkyBox/down.png',
  ]), 0, 5) // 0~4 texture
}
/**
 * 渲染天空盒
 */
export function renderSkyBox(helper: WebGLHelper3d, lookAt: Mat, perspectiveMat: Mat, skyBoxProgram: number) {
  helper.switchProgram(skyBoxProgram)
  let gl = helper.glContext
  Object.keys(faceCoords).forEach((key, i) => {
      helper.prepare({
        attributes: [
          { buffer: SkyBoxVBuffer, data: flatten(faceCoords[key]), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
          { buffer: SkyBoxTBuffer, data: flatten(texCoords), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT }
        ],
        uniforms: [
          { varName: 'uTexture', data: i, method: '1i' },
          { varName: 'uPerspectiveMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
          { varName: 'uWorldMatrix', data: flatten(lookAt), method: 'Matrix4fv' }
        ]
      })
      helper.drawArrays(gl.TRIANGLE_FAN, 0, 4)
  })
}

// 天空盒贴片位置、材质坐标等常量
const texCoords = [
  [0.0, 0.0], [1.0, 0.0],
  [1.0, 1.0], [0.0, 1.0]
]
const n = 1.0
const faceCoords: { [key: string]: Array<Vec3> } = {
  // front做纹理场，请参考textureField.ts
  back: [
    [-n, -n, -1.0], [n, -n, -1.0],
    [n, n, -1.0], [-n, n, -1.0]
  ],
  left: [
    [-1.0, -n, -n], [-1.0, n, -n],
    [-1.0, n, n], [-1.0, -n, n]
  ],
  right: [
    [1.0, -n, -n], [1.0, n, -n],
    [1.0, n, n], [1.0, -n, n]
  ],
  up: [
    [-n, 1.0, -n], [n, 1.0, -n],
    [n, 1.0, n], [-n, 1.0, n]
  ],
  down: [
    [-n, -1.0, -n], [n, -1.0, -n],
    [n, -1.0, n], [-n, -1.0, n]
  ]
}
