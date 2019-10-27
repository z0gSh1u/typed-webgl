import { OBJProcessor } from "./OBJProcessor"

declare var axios: any

export class DrawingObject3d {

  private _objFilePath: string // 模型路径
  private _objProcessor: OBJProcessor | null // 绑定的模型处理器
  private _texturePath: string // 材质（贴图）路径
  public _textureImage: HTMLImageElement | null // 材质（贴图）对象

  constructor(objFilePath: string, texturePath: string) {
    this._objFilePath = objFilePath
    this._texturePath = texturePath
    this._objProcessor = null
    this._textureImage = null
    this._processOBJ()
   // this._processTexture()
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

  private _processOBJ() {
    let responseData: string
    responseData = loadFileAJAX(this._objFilePath) as string
    this._objProcessor = new OBJProcessor(responseData)
  }

  // TODO: synchronize this
  private _processTexture() {

    let textureImage = new Image()
    textureImage.src = this._texturePath

    // let curTick = new Date().getTime()
    // while (1) {
    //   if (new Date().getTime() - curTick >= 150) {
    //     break
    //   }
    // }

    this._textureImage = textureImage
    console.log(this._textureImage)
  }

}