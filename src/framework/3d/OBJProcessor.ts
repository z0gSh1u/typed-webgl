// Object file processor.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

/**
 * 将OBJ模型文件中的顶点坐标信息和面信息提取到JavaScript
 * 【注意】
 * 1. 面必须是三角形，即f后带三个参数
 * 2. f后每个参数允许形式为 xxx/xxx 和 xxx/xxx/xxx，但读取时会忽略纹理和法线信息，即仅使用第一个斜杠前的数据
 * 3. 关于OBJ模型文件格式，请参考https://en.wikipedia.org/wiki/Wavefront_.obj_file#File_format
 * 4. 这里面不会对OBJ归一化，请自行归一化OBJ
 */
export class OBJProcessor {

  private objFileContent: string
  private splitedFileContent: Array<string>

  private _vs: Array<Vec3> // v -1.933082 33.143852 21.139929
  private _fs: Array<Vec3> // f 260 261 262

  constructor(_objFileContent: string) {
    this.objFileContent = _objFileContent
    this.splitedFileContent = []
    this._vs = []
    this._fs = []
    this._fillInfoArray()
  }

  /**
   * 顶点（返回Array<Vec3>代表xyz坐标）
   */
  get vs() {
    return this._vs
  }
  /**
   * 面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
   */
  get fs() {
    return this._fs
  }

  /**
   * 获取总共有效的顶点数量。即考虑了顶点的被重用，而不是仅计数v xxx yyy zzz行的数量。
   */
  public getEffectiveVertexCount() {
    return this._fs.length * 3
  }

  private _fillInfoArray() {
    this.splitedFileContent = this.objFileContent.split('\n')
    this.splitedFileContent.forEach(ele => {
      if (ele[0] === 'v') {
        // 顶点
        let xyz = (ele.split(' ').slice(1)).map(str => parseFloat(str)) as Vec3
        this._vs.push(xyz)
      } else if (ele[0] === 'f') {
        // 面
        let abc = (ele.split(' ').slice(1)).map(str => {
          let front = str.indexOf('/')
          return parseFloat(str.substring(0, front))
        }) as Vec3
        this._fs.push(abc)
      } else {
        // do nothing
      }
    })
  }

}

