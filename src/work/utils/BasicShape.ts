// straight line

/**
 * Generate a straight line segment. (2d)
 */
export function generateStraightLineSegment(startPoint: Vec2, endPoint: Vec2, howManyPoints: number = 100): Array<Vec2> {
  // y = kx + b
  let k = (endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]), b = endPoint[1] - k * endPoint[0]
  let fn: (x: number) => number = x => k * x + b;
  let step = Math.abs(startPoint[0] - endPoint[0]) / howManyPoints
  if (step < 0.001 || step === NaN) {
    throw `[generateStraightLineSegment] Too many points for this line segment. step=${step}`
  }
  let cx = startPoint[0], res: Array<Vec2> = []
  for (let i = 0; i < howManyPoints; i++) {
    res.push([cx, fn(cx)])
    cx += step
  }
  return res
}

// circle

// oval
