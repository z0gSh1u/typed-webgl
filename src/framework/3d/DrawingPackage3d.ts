// 

import { DrawingObject3d } from "./DrawingObject3d";

export class DrawingPackage3d {

  private _innerList: Array<DrawingObject3d>
  private _modelMat: Mat

  constructor(modelMat: Mat, ...objects: Array<DrawingObject3d>) {
    this._innerList = objects.length == 0 ? [] : objects
    this._modelMat = modelMat
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