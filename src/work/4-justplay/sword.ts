// ==================================
// 黄金剑相关代码
// by Twi & z0gSh1u
// ==================================

import { DrawingPackage3d } from "../../framework/3d/DrawingPackage3d";
import { DrawingObject3d } from "../../framework/3d/DrawingObject3d";
import { WebGLHelper3d } from "../../framework/3d/WebGLHelper3d";
import { scaleMat, normalize8bitColor } from "../../framework/WebGLUtils";
import { PhongLightModel } from "../../framework/3d/PhongLightModel";

let vBuffer: WebGLBuffer, nBuffer: WebGLBuffer
let Sword: DrawingPackage3d
export let SwordCtm: Mat = mat4()
export function setSwordCtm(ctm: Mat) { SwordCtm = ctm }
let vs: Vec3[]
let vns: Vec3[]
let waveLock = false
let lightBulbPosition: Vec3 = [0.0, 0.0, 0.0]
export let SwordMaterial = new PhongLightModel({ // 光照参数
  lightPosition: lightBulbPosition, // @deprecated
  ambientColor: [255, 255, 255],
  ambientMaterial: [200, 200, 200],
  diffuseColor: [255, 255, 255],
  diffuseMaterial: [66, 66, 66],
  specularColor: [255, 255, 255],
  specularMaterial: [200, 200, 200],
  materialShiness: 90.0
})

export function SwordModifyLightBulbPosition(newPos: Vec3) {
  lightBulbPosition = newPos
}

export async function initSword(helper: WebGLHelper3d, _lightBulbPosition: Vec3, swordProgram: number) {
  helper.switchProgram(swordProgram)
  vBuffer = helper.createBuffer()
  nBuffer = helper.createBuffer()
  let initSwordMat = mat4()
  initSwordMat = mult(initSwordMat, rotateX(90)) as Mat
  initSwordMat = mult(initSwordMat, rotateZ(60)) as Mat
  initSwordMat = mult(translate(0.85, -0.9, 0.9), initSwordMat) as Mat
  Sword = new DrawingPackage3d(initSwordMat as Mat, ...[
    new DrawingObject3d('sword', './model/normed/minecraft_sword.obj')
  ])
  vs = helper.analyzeFtoV(Sword.getObjectByName('sword') as DrawingObject3d, 'fs') as Vec3[]
  vns = helper.analyzeFtoV(Sword.getObjectByName('sword') as DrawingObject3d, 'fns') as Vec3[]
  vns = vns.map(v3 => {
    let v4 = vec4(...v3, 1.0)
    let shaker = vec3(Math.random(), Math.random(), Math.random())
    v4 = mult(translate(...shaker), v4) as Vec4
    return vec3(...v4)
  })
}

export function renderSword(helper: WebGLHelper3d, ctm: Mat, swordProgram: number) {
  helper.switchProgram(swordProgram)
  let gl = helper.glContext
  helper.prepare({
    attributes: [],
    uniforms: [
      { varName: 'uWorldMatrix', data: flatten(SwordCtm), method: 'Matrix4fv' },
      { varName: 'uModelMatrix', data: flatten(Sword.modelMat), method: 'Matrix4fv' },
      { varName: 'uLightCtm', data: flatten(ctm), method: 'Matrix4fv' },
      { varName: 'uLightPosition', data: [...lightBulbPosition, 1.0], method: '4fv' },
      { varName: 'uShiness', data: SwordMaterial.materialShiness, method: '1f' },
      { varName: 'uAmbientProduct', data: SwordMaterial.ambientProduct, method: '4fv' },
      { varName: 'uDiffuseProduct', data: SwordMaterial.diffuseProduct, method: '4fv' },
      { varName: 'uSpecularProduct', data: SwordMaterial.specularProduct, method: '4fv' },
      {
        varName: 'uWorldMatrixTransInv', data: flatten(transpose(inverse(mat3(
          Sword.modelMat[0][0], Sword.modelMat[0][1], Sword.modelMat[0][2],
          Sword.modelMat[1][0], Sword.modelMat[1][1], Sword.modelMat[1][2],
          Sword.modelMat[2][0], Sword.modelMat[2][1], Sword.modelMat[2][2],
        )))), method: 'Matrix3fv'
      },
    ]
  })
  Sword.innerList.forEach(obj => {
    helper.prepare({
      attributes: [
        { buffer: vBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
        { buffer: nBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
      ],
      uniforms: [
        { varName: 'uColor', data: normalize8bitColor([255, 222, 13]), method: '4fv' }
      ]
    })
    helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount())
  })
}

export function waveSword() {
  if (waveLock) { return }
  waveLock = true
  let old = Sword.modelMat
  Sword.setModelMat(mult(old, rotateX(10)) as Mat)
  window.setTimeout(() => { Sword.setModelMat(old); waveLock = false }, 150)
}