// Generate some basic shapes like circle, oval and straight line.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

/**
 * Generate a straight line segment. (2d)
 */
export function generateStraightLineSegment(startPoint: Vec2, endPoint: Vec2, howManyPoints: number = 100): Array<Vec2> {
  // y = kx + b
  let k = (endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]), b = endPoint[1] - k * endPoint[0]
  let fn: (x: number) => number = x => k * x + b;
  let step = Math.abs(startPoint[0] - endPoint[0]) / howManyPoints
  // if (step < 0.001 || step === NaN) {
  //   throw `[generateStraightLineSegment] Too many points for this line segment. step=${step}`
  // }
  let cx = startPoint[0], res: Array<Vec2> = []
  for (let i = 0; i < howManyPoints; i++) {
    res.push([cx, fn(cx)])
    cx += step
  }
  return res
}

/**
 * Generate a circle. (2d)
 * Please use `TRIANGLE_FAN` method to draw this.
 */
export function generateCircle(center: Vec2, radius: number, howManyPoints: number = 360): Array<Vec2> {
  // 参数方程
  let theta = 0.0 // in DEG
  let step = 360 / howManyPoints
  let res: Array<Vec2> = []
  for (let i = 0; i < howManyPoints; i++) {
    res.push([radius * Math.cos(radians(theta)) + center[0], radius * Math.sin(radians(theta)) + center[1]])
    theta += step
  }
  return res
}

/**
 * Generate a oval for (x/a)^2 + (y/b)^2 = 1. (2d)
 * Please use `TRIANGLE_FAN` method to draw this.
 */
export function generateOval(center: Vec2, a: number, b: number, howManyPoints: number = 360): Array<Vec2> {
  // 参数方程
  let theta = 0.0 // in DEG
  let step = 360 / howManyPoints
  let res: Array<Vec2> = []
  for (let i = 0; i < howManyPoints; i++) {
    res.push([a * Math.cos(radians(theta)) + center[0], b * Math.sin(radians(theta)) + center[1]])
    theta += step
  }
  return res
}
