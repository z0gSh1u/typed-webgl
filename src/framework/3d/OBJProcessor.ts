// Object file processor.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

/**
 * 将OBJ模型文件中的顶点坐标信息和面信息提取到JavaScript
 * 【注意】
 * 1. 面必须是三角形，即f后带三个参数
 * 2. f后每个参数允许形式为 xxx 或 xxx/xxx 或 xxx/xxx/xxx
 * 3. 关于OBJ模型文件格式，请参考https://en.wikipedia.org/wiki/Wavefront_.obj_file#File_format
 * 4. 这里面不会对OBJ的顶点坐标归一化，请自行归一化OBJ
 * 5. 不支持OBJ模型中有多个o的情形，请合并模型到只有一个o
 */
export class OBJProcessor {

  private objFileContent: string
  private splitedFileContent: Array<string>

  private _vs: Array<Vec3> // v -1.933082 33.143852 21.139929
  private _fs: Array<Vec3> // f [x]/9/479 [x]/390/479 [x]/7/479
  private _vts: Array<Vec2> // vt 0.494600 -1.149000
  private _fts: Array<Vec3> // f 9/[x]/479 9/[x]/479 9/[x]/479
  private _vns: Array<Vec3> // vn xxx xxx xxx
  private _fns: Array<Vec3> // f 9/9/[x] 9/390/[x] 9/7/[x]

  constructor(_objFileContent: string) {
    this.objFileContent = _objFileContent
    this.splitedFileContent = []
    this._vs = []
    this._fs = []
    this._vts = []
    this._fts = []
    this._vns = []
    this._fns = []
    this._fillInfoArray()
  }

  /**
   * 模型顶点（返回Array<Vec3>代表xyz坐标）
   */
  get vs() {
    return this._vs
  }
  /**
   * 模型面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
   */
  get fs() {
    return this._fs
  }
  /**
   * 材质顶点（返回Array<Vec2>代表xy坐标）
   */
  get vts() {
    return this._vts
  }
  /**
   * 材质面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
   */
  get fts() {
    return this._fts
  }
  /**
   * 法线顶点（返回Array<Vec3>代表xyz坐标）
   */
  get vns() {
    return this._vns
  }
  /**
   * 法线面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
   */
  get fns() {
    return this._fns
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
      if (ele.match(/v .*/)) {
        // 模型顶点
        let xyz = (ele.split(' ').slice(1)).map(str => parseFloat(str)) as Vec3
        this._vs.push(xyz)
      } else if (ele.match(/vt.*/)) {
        // 材质顶点
        let xy = (ele.split(' ').slice(1)).map(str => parseFloat(str)) as Vec2
        this._vts.push(xy)
      } else if (ele.match(/vn.*/)) {
        // 法线顶点
        let xyz = (ele.split(' ').slice(1)).map(str => parseFloat(str)) as Vec3
        this._vns.push(xyz)
      } else if (ele[0] === 'f') {
        // 面处理
        if (ele.indexOf('/') == - 1) {
          // f 1 1 1
          let abc = (ele.split(' ').slice(1)).map(str => {
            return parseInt(str)
          }) as Vec3
          this._fs.push(abc)
        } else {
          if (ele.match(/f [0-9]+\/[0-9]+\/[0-9]+ [0-9]+\/[0-9]+\/[0-9]+ [0-9]+\/[0-9]+\/[0-9]+/)) {
            // f 3/3/3 3/3/3 3/3/3
            let newEle = ele.substring(2)
            newEle = newEle.replace(/\//g, ' ')
            let intCvted = (newEle.split(' ')).map(str => parseInt(str))
            this._fs.push([intCvted[0], intCvted[3], intCvted[6]] as Vec3)
            this._fts.push([intCvted[1], intCvted[4], intCvted[7]] as Vec3)
            this._fns.push([intCvted[2], intCvted[5], intCvted[8]] as Vec3)
          } else {
            // f 2/2 2/2 2/2
            let newEle = ele.substring(2)
            newEle = newEle.replace(/\//g, ' ')
            let intCvted = (newEle.split(' ')).map(str => parseInt(str))
            this._fs.push([intCvted[0], intCvted[2], intCvted[4]] as Vec3)
            this._fts.push([intCvted[1], intCvted[3], intCvted[5]] as Vec3)
          }
        }
      } else {
        // do nothing
      }
    })
  }

}

