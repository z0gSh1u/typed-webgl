// ==================================
// 魔法方块（环境反射）
// by z0gSh1u, LongChen, Twi
// ==================================

import { getLookAt } from "./roam";
import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";

let vBuffer: WebGLBuffer
let nBuffer: WebGLBuffer
let texture: WebGLTexture

// TODO: use Promise
export function initMagicCube(canvasDOM: HTMLCanvasElement, helper: WebGLHelper3d, magicCubeProgram: number) {
  helper.switchProgram(magicCubeProgram)
  let gl = helper.glContext
  vBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()
  texture = gl.createTexture() as WebGLTexture
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: './model/texture/Cube/X+.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: './model/texture/Cube/X-.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: './model/texture/Cube/Y-.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: './model/texture/Cube/Y-.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: './model/texture/Cube/Z+.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: './model/texture/Cube/Z-.png',
    },
  ]

  faceInfos.forEach(faceInfo => {
    const { target, url } = faceInfo
    const level = 0
    const internalFormat = gl.RGBA
    const width = 512
    const height = 512
    const format = gl.RGBA
    const type = gl.UNSIGNED_BYTE
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null)
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function () {
      gl.activeTexture(gl.TEXTURE20)
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    })
  })
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}

export function renderMagicCube(helper: WebGLHelper3d, perspectiveMat: Mat, programIndex: number, theta: number) {
  helper.switchProgram(programIndex)
  let gl = helper.glContext
  let ctm = getLookAt()
  helper.prepare({
    attributes: [
      { buffer: vBuffer, data: positions, varName: 'vPoition', attrPer: 3, type: gl.FLOAT },
      { buffer: nBuffer, data: normals, varName: 'Normal', attrPer: 3, type: gl.FLOAT },
    ],
    uniforms: [
      { varName: 'texMap', data: 20, method: '1i' },
      { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
      { varName: 'uModelMatrix', data: flatten(translate(-0.3, -0.5, 0)), method: 'Matrix4fv' },
      { varName: 'uProjectionMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
    ]
  })
  helper.drawArrays(gl.TRIANGLES, 0, 6 * 6)
}
// 坐标信息
const n = 0.2
let positions = new Float32Array([
  -n, -n, -n, -n, n, -n,
  n, -n, -n, -n, n, -n,
  n, n, -n, n, -n, -n,
  -n, -n, n, n, -n, n,
  -n, n, n, -n, n, n,
  n, -n, n, n, n, n,
  -n, n, -n, -n, n, n,
  n, n, -n, -n, n, n,
  n, n, n, n, n, -n,
  -n, -n, -n, n, -n, -n,
  -n, -n, n, -n, -n, n,
  n, -n, -n, n, -n, n,
  -n, -n, -n, -n, -n, n,
  -n, n, -n, -n, -n, n,
  -n, n, n, -n, n, -n,
  n, -n, -n, n, n, -n,
  n, -n, n, n, -n, n,
  n, n, -n, n, n, n,
])
let normals = new Float32Array([
  0, 0, -1, 0, 0, -1,
  0, 0, -1, 0, 0, -1,
  0, 0, -1, 0, 0, -1,
  0, 0, 1, 0, 0, 1,
  0, 0, 1, 0, 0, 1,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0,
  0, 1, 0, 0, 1, 0,
  0, 1, 0, 0, 1, 0,
  0, -1, 0, 0, -1, 0,
  0, -1, 0, 0, -1, 0,
  0, -1, 0, 0, -1, 0,
  -1, 0, 0, -1, 0, 0,
  -1, 0, 0, -1, 0, 0,
  -1, 0, 0, -1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0,
])
