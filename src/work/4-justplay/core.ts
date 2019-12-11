// Core code of 4-JustPlay
// by z0gSh1u & LongChen.
import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { DrawingObject3d } from '../../framework/3d/DrawingObject3d'
import { DrawingPackage3d } from '../../framework/3d/DrawingPackage3d'
import { PhongLightModel } from '../../framework/3d/PhongLightModel'
// ==================================
// 主要变量
// ==================================
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl', { alpha: true, premultipliedAlpha: false }) as WebGLRenderingContext
let helper: WebGLHelper3d
let PROGRAMS = {
  BOX: 0, PONY: 1
}
let ctm: Mat
// ==================================
// 透视使用
// ==================================
let cpm: Mat
let fovy = 45.0
let aspect = -16 / 9
let near = 0.1
let far = 5.0
let preCalculatedCPM = perspective(fovy, aspect, near, far)
// ==================================
// 盒空间
// ==================================
let SkyBoxVBuffer: WebGLBuffer
// ==================================
// 观察相机使用
// !! 请注意，pos->at与pos->up不能共线 !!
// ==================================
const ROTATE_PER_Y_FPV = 0.09
const ROTATE_PER_X_FPV = 0.09
const VEC_Y = vec3(0.0, 1.0, 0.0)
const ANGLE_UP_MAX = 89
const ANGLE_DOWN_MAX = -89
const VEC_UP_MAX = vec4(0.0, Math.sin(ANGLE_UP_MAX), Math.cos(ANGLE_UP_MAX), 1)
const VEC_DOWN_MAX = vec4(0.0, Math.sin(ANGLE_DOWN_MAX), Math.cos(ANGLE_DOWN_MAX), 1)
const INTERVAL = 40 // 速度降低的毫秒间隔
let curTick: number
let lastTick: number
let cameraPos = vec3(0.0, 0.0, -1.0)
let cameraFront = vec3(0.0, 0.1, 1.0)
let cameraSpeed = 0.04
let cameraMoveId: number = 0 // 相机移动计时器编号

// 初始化
let main = async () => {
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  helper = new WebGLHelper3d(canvasDOM, gl, [
    WebGLUtils.initializeShaders(gl, './shader/vSkyBox.glsl', './shader/fSkyBox.glsl'),
  ])

  gl.enable(gl.DEPTH_TEST)
  ctm = mat4()
  // 初始化各buffer
  SkyBoxVBuffer = helper.createBuffer()
  await initBox()
  listenKeyboardFPV()
  listenMouseToTurnCamera()
}

let initBox = async () => {
  helper.switchProgram(PROGRAMS.BOX)

  // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  // gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // let images = await WebGLUtils.loadImageAsync([
  //   './model/texture/SkyBox/front.png',
  //   './model/texture/SkyBox/back.png',
  //   './model/texture/SkyBox/up.png',
  //   './model/texture/SkyBox/down.png',
  //   './model/texture/SkyBox/left.png',
  //   './model/texture/SkyBox/right.png',
  // ])
  // helper.sendCubeMapTextureToGPU(images[0], '+x')
  // helper.sendCubeMapTextureToGPU(images[1], '+y')
  // helper.sendCubeMapTextureToGPU(images[2], '+z')
  // helper.sendCubeMapTextureToGPU(images[3], '-x')
  // helper.sendCubeMapTextureToGPU(images[4], '-y')
  // helper.sendCubeMapTextureToGPU(images[5], '-z')
  

  var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
 
const faceInfos = [
  {
    target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
    url: './model/texture/SkyBox/left.png',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
    url: './model/texture/SkyBox/left.png',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
    url: './model/texture/SkyBox/left.png',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
    url: './model/texture/SkyBox/left.png',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
    url:'./model/texture/SkyBox/left.png',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
    url: './model/texture/SkyBox/left.png',
  },
];
faceInfos.forEach((faceInfo) => {
  const {target, url} = faceInfo;
  // 上传画布到立方体贴图的每个面
  const level = 0;
  const format = gl.RGBA;
  const width = 1024;
  const height = 1024;
  const type = gl.UNSIGNED_BYTE;
  // 设置每个面，使其立即可渲染
  gl.texImage2D(target, level, format, width, height, 0, format, type, null);
 
  // 异步加载图片
  const image = new Image();
  image.src = url;
  image.onload = function() {
    // 图片加载完成将其拷贝到纹理
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texImage2D(target, level, format, format, type, image);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  };
});
gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  let positions = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]
  let cameraMatrix = lookAt([-0.5,0,0],[0,0,0],[0,1,0])
  let viewMatrix = inverse(cameraMatrix)
  viewMatrix[3][0] = viewMatrix[3][1] = viewMatrix[3][2] = 0
  let proj = preCalculatedCPM
  let viewDirectionProjMatrix = mult(proj, viewMatrix)
  let viewDirectionProjMatrixInv = inverse(viewDirectionProjMatrix as Mat)
  helper.prepare({
    attributes: [
      { buffer: SkyBoxVBuffer, data: flatten(positions), varName: 'aPosition', attrPer: 2, type: gl.FLOAT },
    ],
    uniforms: [
      { varName: 'uSkyBox', data: 0, method: '1i' },
      {
        varName: 'uProjectionWorldMatrixInv', data: flatten(
          viewDirectionProjMatrixInv
        ), method: 'Matrix4fv'
      },
    ]
  })

  helper.drawArrays(gl.TRIANGLES, 0, 6)
}

let reRenderBox = () => {

}

let reRender = (aa: Mat) => {
  ctm = lookAt(cameraPos, add(cameraPos, cameraFront) as Vec3, VEC_Y)

  reRenderBox()
}

// ==================================
// 第一人称视角实现
// ==================================
// 鼠标侦听
let listenMouseToTurnCamera = () => {
  canvasDOM.onmousedown = (evt: MouseEvent) => {
    let mousePoint = [evt.offsetX, evt.offsetY] as Vec2
    let lastTrickTick = new Date().getTime()
    let curTrickTick = lastTick
    const MIN_INTERVAL = 40
    canvasDOM.onmousemove = (evt2: MouseEvent) => {
      curTrickTick = new Date().getTime()
      if (curTrickTick - lastTrickTick < MIN_INTERVAL) {
        return
      }
      lastTrickTick = curTrickTick
      let newMousePoint = [evt2.offsetX, evt2.offsetY] as Vec2
      let translateVector = newMousePoint.map((v, i) => v - mousePoint[i]) as Vec2
      mousePoint = newMousePoint
      cameraFront = normalize(
        vec3(...(mult(rotateY(ROTATE_PER_X_FPV * translateVector[0]),
          vec4(...cameraFront, 1)) as Vec4)
          .slice(0, 3)), false) as Vec3
      let initZ = Math.sqrt(cameraFront[0] * cameraFront[0] + cameraFront[2] * cameraFront[2])
      let tempVec = vec4(0, cameraFront[1], initZ, 1)
      tempVec = mult(rotateX(ROTATE_PER_Y_FPV * translateVector[1]), tempVec) as Vec4
      if (tempVec[1] > VEC_UP_MAX[1] && tempVec[2] >= 0 || tempVec[1] > 0 && tempVec[2] < 0) {
        tempVec = VEC_UP_MAX
      } else if (tempVec[1] < VEC_DOWN_MAX[1] && tempVec[2] >= 0 || tempVec[1] < 0 && tempVec[2] < 0) {
        tempVec = VEC_DOWN_MAX
      }
      let newZ = tempVec[2]
      cameraFront = vec3(cameraFront[0] * newZ / initZ, tempVec[1], cameraFront[2] * newZ / initZ)
      reRender(ctm)
    }
  }
  // 如果想要不按住也可以鼠标观察，则注释下列钩子
  canvasDOM.onmouseup = () => {
    canvasDOM.onmousemove = () => { }
  }
}
// 键盘侦听
let isKeyDown: { [key: string]: boolean } = {
  '87'/*W*/: false,
  '65'/*A*/: false,
  '83'/*S*/: false,
  '68'/*D*/: false,
  '32'/*Space*/: false,
  '16'/*Shift*/: false
}
let listenKeyboardFPV = () => {
  isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false
  window.onkeydown = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      isKeyDown[e.keyCode] = true
      if (cameraMoveId == 0) {
        cameraMoveId = window.setInterval(moveCamera, INTERVAL)
      }
    }
  }
  window.onkeyup = (e: KeyboardEvent) => {
    if (e && e.keyCode) {
      isKeyDown[e.keyCode] = false
    }
  }
}
let moveCamera = () => {
  let cameraMoveSpeed = vec3(0, 0, 0)
  let frontVec = normalize(vec3(cameraFront[0], 0, cameraFront[2]), false)
  let leftVec = normalize(cross(VEC_Y, cameraFront), false)
  let moveFlag = false
  if (isKeyDown['87'/*W*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), frontVec)) as Vec3
    moveFlag = true
  }
  if (isKeyDown['83'/*S*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), frontVec)) as Vec3
    moveFlag = true
  }
  if (isKeyDown['65'/*A*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), leftVec)) as Vec3
    moveFlag = true
  }
  if (isKeyDown['68'/*D*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), leftVec)) as Vec3
    moveFlag = true
  }
  if (isKeyDown['32'/*Space*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), VEC_Y)) as Vec3
    moveFlag = true
  }
  if (isKeyDown['16'/*Shift*/]) {
    cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), VEC_Y)) as Vec3
    moveFlag = true
  }
  if (!moveFlag) {
    clearInterval(cameraMoveId)
    cameraMoveId = 0
    return
  }
  cameraPos = add(cameraPos, cameraMoveSpeed) as Vec3
  reRender(ctm)
}

main()