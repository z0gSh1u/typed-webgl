// 

import { DrawingObject3d } from './DrawingObject3d'
import { normalize8bitColor } from '../WebGLUtils'

export class DrawingPackage3d {

  private _innerList: Array<DrawingObject3d>
  private _modelMat: Mat
  private _meshOnly: boolean
  private _colorMeshOnly: Vec4 | null
  private _methodMeshOnly: number | null

  constructor(modelMat: Mat, ...objects: Array<DrawingObject3d>) {
    this._innerList = objects.length == 0 ? [] : objects
    this._modelMat = modelMat
    this._meshOnly = false
    this._colorMeshOnly = null
    this._methodMeshOnly = null
  }

  public setObjectExtraMatrix(name: string, newMat: Mat) {
    for (let i = 0; i < this._innerList.length; i++) {
      if (this._innerList[i].name == name) {
        this._innerList[i].setExtraMatrix(newMat)
      }
    }
  }

  public getObjectByName(name: string): DrawingObject3d | null {
    let result: DrawingObject3d | null = null
    this._innerList.forEach(ele => {
      if (ele.name == name) {
        result = ele
      }
    })
    return result
  }

  public setMeshOnly(method: number, color8bit: Vec3 | Vec4) {
    this._meshOnly = true
    this._colorMeshOnly = normalize8bitColor(color8bit)
    this._methodMeshOnly = method
  }

  get colorMeshOnly() {
    return this._colorMeshOnly
  }

  get methodMeshOnly() {
    return this._methodMeshOnly
  }

  get meshOnly() {
    return this._meshOnly
  }

  get modelMat() {
    return this._modelMat
  }

  get innerList() {
    return this._innerList
  }

  set modelMat(newMat: Mat) {
    this._modelMat = newMat
  }

  public push(obj: DrawingObject3d) {
    this.innerList.push(obj)
  }

  public setModelMat(newMat: Mat) {
    this._modelMat = newMat
  }

  public preloadTexture(callback: (loadedElements: HTMLImageElement[]) => void) {
    let newImages: Array<HTMLImageElement> = [], loadedImagesCount = 0
    let _arr = this.innerList
    let arr = (typeof _arr != "object") ? [_arr] : _arr
    function sendImageLoadedMessage() {
      loadedImagesCount++
      if (loadedImagesCount == arr.length) {
        callback(newImages)
      }
    }
    for (let i = 0; i < arr.length; i++) {
      newImages[i] = new Image()
      newImages[i].src = arr[i].texturePath
      newImages[i].onload = () => {
        sendImageLoadedMessage()
      }
      newImages[i].onerror = () => {
        sendImageLoadedMessage()
      }
    }
  }

}