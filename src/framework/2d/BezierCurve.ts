// Generate Bezier Curve (L3) using two end point and two control point.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).

/**
 * Generate Lv3 2d Bezier Curve. Return points on the curve.
 */
export function generateBezierCurve2dL3(start: Vec2, control1: Vec2, control2: Vec2, end: Vec2, step: number = 0.01): Array<Vec2> {

  // P(t) = (1-t)^3P1 + 3t(1-t)^2P2 + 3t^2(1-t)P3 + t^3P4
  // t in [0,1]
  // P1->P2, P3->P4 cut the curve
  let t = 0.0, result: Array<Vec2> = []
  while (t <= 1) {
    let ts = 1 - t
    let x = ts * ts * ts * start[0] + 3 * t * ts * ts * control1[0] + 3 * t * t * ts * control2[0] + t * t * t * end[0]
    let y = ts * ts * ts * start[1] + 3 * t * ts * ts * control1[1] + 3 * t * t * ts * control2[1] + t * t * t * end[1]
    result.push([x, y])
    t += step
  }
  return result

}
