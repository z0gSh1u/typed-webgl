import { WebGLDrawingObject } from "./WebGLDrawingObject";

// WebGL drawing package.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

/**
 * A `WebGLDrawingPackage` is something that contains many `WebGLDrawingObject`.
 * You can use it to store a specific part of your entity.
 */
export class WebGLDrawingPackage {

  private innerList: Array<WebGLDrawingObject>

  constructor(...objects: Array<WebGLDrawingObject>) {
    this.innerList = objects.length == 0 ? [] : objects
  }

  public push(obj: WebGLDrawingObject) {
    this.innerList.push(obj)
  }

  /**
   * Perform a function to all object's rawData and re-cook it. 
   * Your function should take a parameter=`element` and return the processed value.
   */
  public performToAllObjectData(fn: (arg: any) => any) {
    this.innerList.forEach(ele => {
      console.log(ele.getCookedData())
      ele.setData(ele.getRawData().map(fn), true)
      console.log(ele.getCookedData())
    })
  }

  /**
   * Calculate the hit box of this package. Returns [xmin, xmax, ymin, ymax] as Vec4 (Rect).
   */
  public calculateHitBox(): Vec4 {
    let xmin = 99999, xmax = -99999, ymin = 99999, ymax = -99999
    this.innerList.forEach(ele => {
      ele.getRawData().forEach(rd => {
        let _rd = rd as Vec2
        if (xmin > _rd[0]) xmin = _rd[0]
        if (xmax < _rd[0]) xmax = _rd[0]
        if (ymin > _rd[1]) ymin = _rd[1]
        if (ymax < _rd[1]) ymax = _rd[1]
      })
    })
    return [xmin, xmax, ymin, ymax] as Vec4
  }

  /**
   * Get `innerList` of package.
   */
  public getInnerList() {
    return this.innerList
  }

  /**
   * Get an object using `name`.
   */
  public getAnObject(name: string) {
    for (let i = 0; i < this.innerList.length; i++) {
      if (this.innerList[i].getName() == name) {
        return this.innerList[i]
      }
    }
  }

  /**
   * Remove an object in `innerList` using `name`. If not found, do nothing. 
   */
  public removeAnObject(name: string) {
    for (let i = 0; i < this.innerList.length; i++) {
      if (this.innerList[i].getName() == name) {
        this.innerList.splice(i, 1)
        break
      }
    }
  }

  /**
   * Modify an object in `innerList` using `name`. If not found, do nothing. 
   */
  public modifyAnObject(name: string, newObject: WebGLDrawingObject) {
    for (let i = 0; i < this.innerList.length; i++) {
      if (this.innerList[i].getName() == name) {
        this.innerList[i] = newObject
        break
      }
    }
  }

}