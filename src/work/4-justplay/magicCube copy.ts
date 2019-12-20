import { initializeShaders, scaleMat } from "../../framework/WebGLUtils";
import { preCalculatedCPM, getLookAt, cameraPos } from "./roam";
import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";

// 魔法方块

let vBuffer: WebGLBuffer
let nBuffer: WebGLBuffer
let texture: WebGLTexture

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
      url: './model/texture/Cube/1.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: './model/texture/Cube/2.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: './model/texture/Cube/3.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: './model/texture/Cube/4.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: './model/texture/Cube/5.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: './model/texture/Cube/6.png',
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

let then = 0
var modelXRotationRadians = 0
var modelYRotationRadians = 0
let ped = false
export function renderMagicCube(helper: WebGLHelper3d, programIndex: number, time: number) {
  helper.switchProgram(programIndex)
  let gl = helper.glContext
  // convert to seconds
  time *= 0.001;
  // Subtract the previous time from the current time
  var deltaTime = time - then;
  // Remember the current time for the next frame.
  then = time;

  // Animate the rotation
  modelYRotationRadians += -0.7 * deltaTime;
  modelXRotationRadians += -0.4 * deltaTime;


  // Compute the camera's matrix using look at.
  //  let cameraMatrix = getLookAt()
  // Make a view matrix from the camera matrix.
  // let viewMatrix = inverse(cameraMatrix)
  let viewMatrix = inverse(getLookAt())
  viewMatrix = mult(scaleMat(0.5, 0.5, 0.5), viewMatrix) as Mat

  let worldMatrix = mat4()

  if (!ped) printm(worldMatrix)
  ped = true
  // printm(viewMatrix)
  // printm(cameraMatrix)
  // printm(worldMatrix)

  helper.prepare({
    attributes: [
      { buffer: vBuffer, data: positions, varName: 'a_position', attrPer: 3, type: gl.FLOAT },
      { buffer: nBuffer, data: normals, varName: 'a_normal', attrPer: 3, type: gl.FLOAT },
    ],
    uniforms: [
      { varName: 'u_projection', data: flatten(mat4()), method: 'Matrix4fv' },
      { varName: 'u_view', data: flatten(viewMatrix), method: 'Matrix4fv' },
      { varName: 'u_world', data: flatten(worldMatrix), method: 'Matrix4fv' },
      { varName: 'u_worldCameraPosition', data: cameraPos, method: '3fv' },
      { varName: 'u_texture', data: 20, method: '1i' }
    ]
  })

  // Draw the geometry.
  gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

}

let positions = new Float32Array([
  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
  0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
  0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
  0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
  -0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
  0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
  0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
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
