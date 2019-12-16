let timerID: number
let hasStart: boolean = false
let lightBulbPosition: Vec3 = [0.0, 1.0, 0.0]

const PER_ROTATE_DEG = 7

let lightAutoRotateAtom = () => {
  let v4 = vec4(...lightBulbPosition, 1.0)
  v4 = mult(rotateZ(PER_ROTATE_DEG), v4) as Vec4
  lightBulbPosition = vec3(...v4)
}

export function getLightBulbPosition() {
  return lightBulbPosition
}

export function startLightBulbAutoRotate(msPeriod: number) {
  timerID = window.setInterval(() => {
    lightAutoRotateAtom()
  }, msPeriod)
  hasStart = true
}

export function stopLightBulbAutoRotate() {
  if (hasStart) {
    window.clearInterval(timerID)
  }
  hasStart = false
}

export function setLightBulbPositionForce(v3: Vec3) {
  stopLightBulbAutoRotate()
  lightBulbPosition = v3
}