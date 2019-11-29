// Drawing object (3d) definition.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

import { OBJProcessor } from "./OBJProcessor"

export class DrawingObject3d {

  private _name: string // Object命名
  private _objFilePath: string // 模型路径
  private _objProcessor: OBJProcessor | null // 绑定的模型处理器
  private _texturePath: string // 材质（贴图）路径
  private _textureImage: HTMLImageElement | null // 材质（贴图）对象
  private _textureIndex: number | null // 材质变量索引
  private _extraMatrix: Mat // 专属变换矩阵

  constructor(name: string, objFilePath: string, texturePath?: string, textureIndex?: number) {
    this._name = name
    this._objFilePath = objFilePath
    this._texturePath = texturePath as string
    this._objProcessor = null
    this._textureImage = null
    this._textureIndex = textureIndex as number
    this._extraMatrix = mat4()
    this._processOBJ()
  }

  public setExtraMatrix(newMat: Mat) {
    this._extraMatrix = newMat
  }

  get name() {
    return this._name
  }

  get extraMatrix() {
    return this._extraMatrix
  }

  get objProcessor() {
    return this._objProcessor as OBJProcessor
  }

  get texturePath() {
    return this._texturePath
  }

  get textureImage() {
    return this._textureImage
  }

  get textureIndex() {
    return this._textureIndex
  }

  private _processOBJ() {
    let responseData: string
    responseData = loadFileAJAX(this._objFilePath) as string
    this._objProcessor = new OBJProcessor(responseData)
  }

}