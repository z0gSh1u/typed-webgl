// ==================================
// 小马渲染
// by z0gSh1u
// ==================================

import { DrawingPackage3d } from "../../framework/3d/DrawingPackage3d";
import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";
import { scaleMat, loadImageAsync } from "../../framework/WebGLUtils";
import { DrawingObject3d } from "../../framework/3d/DrawingObject3d";
import { PhongLightModel } from "../../framework/3d/PhongLightModel";

let Pony: DrawingPackage3d // 小马全身
let vBuffer: WebGLBuffer, nBuffer: WebGLBuffer, tBuffer: WebGLBuffer
let lightBulbPosition: Vec3 = [0.0, 0.0, 0.0]
const PonyMaterial = new PhongLightModel({ // 小马光照参数
  lightPosition: lightBulbPosition, // @deprecated
  ambientColor: [255, 255, 255],
  ambientMaterial: [200, 200, 200],
  diffuseColor: [255, 255, 255],
  diffuseMaterial: [66, 66, 66],
  specularColor: [255, 255, 255],
  specularMaterial: [200, 200, 200],
  materialShiness: 30.0
})

// TODO: 仅Analyze一次fs, fns, fts

export function PonyModifyLightBuldPosition(newPos: Vec3) {
  lightBulbPosition = newPos
}

export async function initPony(helper: WebGLHelper3d, _lightBulbPosition: Vec3, ponyProgram: number) {
  helper.switchProgram(ponyProgram)
  PonyModifyLightBuldPosition(_lightBulbPosition)
  vBuffer = helper.createBuffer()
  tBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()
  let initPonyModelMat = mult(rotateZ(180), rotateX(270))
  initPonyModelMat = mult(translate(0.7, -1.32, 0.5), initPonyModelMat)
  initPonyModelMat = mult(scaleMat(0.75, 0.75, 0.75), initPonyModelMat)
  Pony = new DrawingPackage3d(initPonyModelMat as Mat, ...[
    new DrawingObject3d('body', './model/normed/Pony/pony.obj', './model/texture/Pony/pony.png', 6), // 身体
    new DrawingObject3d('tail', './model/normed/Pony/tail.obj', './model/texture/Pony/tail.png', 7), // 尾巴
    new DrawingObject3d('hairBack', './model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png', 8), // 头发后
    new DrawingObject3d('hairFront', './model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png', 9), // 头发前
    new DrawingObject3d('horn', './model/normed/Pony/horn.obj', './model/texture/Pony/horn.png', 10), // 角
    new DrawingObject3d('leftEye', './model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png', 11), // 左眼
    new DrawingObject3d('rightEye', './model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png', 12), // 右眼
    new DrawingObject3d('teeth', './model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png', 13), // 牙
    new DrawingObject3d('eyelashes', './model/normed/Pony/eyelashes.obj', './model/texture/Pony/eyelashes.png', 14), // 睫毛
  ])
  // 设置小马纹理，6-14号
  let urls: Array<string> = []
  Pony.innerList.forEach(obj => {
    urls.push(obj.texturePath)
  })
  helper.sendTextureImageToGPU(await loadImageAsync(urls), 6, 15)
}

export function renderPony(helper: WebGLHelper3d, ctm: Mat, perspectiveMat: Mat, ponyProgram: number) {
  helper.switchProgram(ponyProgram)
  let gl = helper.glContext
  helper.prepare({
    attributes: [],
    uniforms: [
      { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
      { varName: 'uLightCtm', data: flatten(ctm), method: 'Matrix4fv' },
      { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
      { varName: 'uProjectionMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
      { varName: 'uLightPosition', data: [...lightBulbPosition, 1.0], method: '4fv' },
      { varName: 'uShiness', data: PonyMaterial.materialShiness, method: '1f' },
      { varName: 'uAmbientProduct', data: PonyMaterial.ambientProduct, method: '4fv' },
      { varName: 'uDiffuseProduct', data: PonyMaterial.diffuseProduct, method: '4fv' },
      { varName: 'uSpecularProduct', data: PonyMaterial.specularProduct, method: '4fv' },
      {
        varName: 'uWorldMatrixTransInv', data: flatten(transpose(inverse(mat3(
          Pony.modelMat[0][0], Pony.modelMat[0][1], Pony.modelMat[0][2],
          Pony.modelMat[1][0], Pony.modelMat[1][1], Pony.modelMat[1][2],
          Pony.modelMat[2][0], Pony.modelMat[2][1], Pony.modelMat[2][2],
        )))), method: 'Matrix3fv'
      },
    ]
  })
  Pony.innerList.forEach(obj => {
    let vs = helper.analyzeFtoV(obj, 'fs'),
      vts = helper.analyzeFtoV(obj, 'fts'),
      vns = helper.analyzeFtoV(obj, 'fns')
    helper.prepare({
      attributes: [
        { buffer: vBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
        { buffer: tBuffer, data: flatten(vts), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT },
        { buffer: nBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
      ],
      uniforms: [
        { varName: 'uTexture', data: obj.textureIndex, method: '1i' },
      ]
    })
    helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())
  })
}