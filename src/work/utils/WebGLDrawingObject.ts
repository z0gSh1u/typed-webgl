// WebGL drawing object.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

export class WebGLDrawingObject {

  private name: string
  private data: Array<any>
  private preFn: any
  private method: number
  private arg1: number
  private arg2: number
  private color: Vec3 | Vec4
  private cookedData: Array<any>

  constructor(_name: string, _data: Array<any>, _preFn: any, _method: number, _color: Vec3 | Vec4, _arg1?: number, _arg2?: number) {
    this.name = _name
    this.data = _data
    this.preFn = _preFn
    this.method = _method
    this.cookedData = []
    this.cookData()
    this.arg1 = _arg1 ? _arg1 : 0
    this.arg2 = _arg2 ? _arg2 : this.cookedData.length
    this.color = _color
  }

  public getMethod(): number { return this.method }
  public getArg1(): number { return this.arg1 }
  public getArg2(): number { return this.arg2 }
  public getColor(): Vec3 | Vec4 { return this.color }
  public getCookedData(): Array<any> { return this.cookedData }
  public getRawData(): Array<any> { return this.data }

  /**
   * Get the name of this object.
   */
  public getName(): string {
    return this.name
  }

  /**
   * Set a new raw data, and you can cook it again.
   */
  public setData(newData: any, cookAgain: boolean = true): void {
    if (cookAgain) {
      this.data = this.preFn(newData)
    } else {
      this.data = newData
    }
  }

  /**
   * Set a new preprocess function.
   */
  public setPreFn(newPreFn: any): void {
    this.preFn = newPreFn
  }

  /**
   * Cook the raw data manually using `this.preFn`.
   */
  public cookData() {
    if (this.preFn) {
      this.cookedData = this.preFn(...this.data)
    } else {
      this.cookedData = this.data
    }
  }

}
