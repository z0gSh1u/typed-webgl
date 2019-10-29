// Collision box. (Not used currently.)
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

export class CollisionBox {

  private _eightVertices: [Vec3, Vec3, Vec3, Vec3, Vec3, Vec3, Vec3, Vec3]

  constructor(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number) {
    this._eightVertices = [
      [xmin, ymin, zmin],
      [xmin, ymin, zmax],
      [xmin, ymax, zmin],
      [xmin, ymax, zmax],
      [xmax, ymin, zmin],
      [xmax, ymin, zmax],
      [xmax, ymax, zmin],
      [xmax, ymax, zmax]
    ]
  }

  get vertices() {
    return this._eightVertices
  }

  public performMatMul(mat: Mat, rightMul: boolean = true) {
    this._eightVertices.map(v => rightMul ? mult(v, mat) as Vec3 : mult(mat, v) as Vec3)
  }

}

export function checkCollision(box1: CollisionBox, box2: CollisionBox) {

}