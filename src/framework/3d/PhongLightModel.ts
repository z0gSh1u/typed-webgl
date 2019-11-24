// Phong light model.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import { normalize8bitColor } from "../WebGLUtils"

export type RGBColor = Vec3 | Vec4

export class PhongLightModel {

  private _lightPosition: Vec4 // 光源位置

  private _ambientColor: Vec4 // 环境光颜色
  private _diffuseColor: Vec4 // 漫反射颜色（弥散光）
  private _specularColor: Vec4 // 镜面反射颜色

  private _ambientMaterial: Vec4 // 环境光材质参数
  private _diffuseMaterial: Vec4 // 漫反射光材质参数
  private _specularMaterial: Vec4 // 镜面反射光材质参数
  private _materialShiness: number // 镜面反射高光系数

  // 预计算
  private _ambientProduct: Vec4
  private _diffuseProduct: Vec4
  private _specularProduct: Vec4

  constructor(cfg: {
    lightPosition: Vec3,
    ambientColor: RGBColor,
    ambientMaterial: RGBColor,
    diffuseColor: RGBColor,
    diffuseMaterial: RGBColor,
    specularColor: RGBColor,
    specularMaterial: RGBColor,
    materialShiness: number
  }) {
    this._lightPosition = [...cfg.lightPosition, 1.0] as Vec4
    this._ambientColor = normalize8bitColor(cfg.ambientColor)
    this._diffuseColor = normalize8bitColor(cfg.diffuseColor)
    this._specularColor = normalize8bitColor(cfg.specularColor)
    this._ambientMaterial = normalize8bitColor(cfg.ambientMaterial)
    this._diffuseMaterial = normalize8bitColor(cfg.diffuseMaterial)
    this._specularMaterial = normalize8bitColor(cfg.specularMaterial)
    this._materialShiness = cfg.materialShiness
    this._ambientProduct = mult(this._ambientColor, this._ambientMaterial) as Vec4
    this._diffuseProduct = mult(this._diffuseColor, this._diffuseMaterial) as Vec4
    this._specularProduct = mult(this._specularColor, this._specularMaterial) as Vec4
  }

  public setLightPosition(newPos: Vec3) {
    this._lightPosition = [...newPos, 1.0] as Vec4
  }

  get lightPosition() {
    return this._lightPosition.slice(0, 3) as Vec3
  }

  get ambientProduct() {
    return this._ambientProduct
  }

  get diffuseProduct() {
    return this._diffuseProduct
  }

  get specularProduct() {
    return this._specularProduct
  }

  get materialShiness() {
    return this._materialShiness
  }

}