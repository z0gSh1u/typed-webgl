// Core code of 2-Pony.

import '../../3rd-party/MV'
import '../../3rd-party/initShaders'
import { WebGLHelper3d } from '../../framework/3d/WebGLHelper3d'
import * as WebGLUtils from '../../framework/WebGLUtils'
import { ObjProcessor } from '../../framework/3d/OBJProcessor'

// use axios
declare var axios: any

// common variables
let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
let program: WebGLProgram
let helper: WebGLHelper3d
let vBuffer: WebGLBuffer

// main function
let main = () => {

  // initialization
  WebGLUtils.initializeCanvas(gl, canvasDOM)
  program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl')
  helper = new WebGLHelper3d(canvasDOM, gl, program)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  vBuffer = helper.createBuffer()

  initPony()

}

// initialize the pony
async function initPony() {
  
  let vertices: Array<Vec3> = []
  let colors = new Float32Array([
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ])

  // 读OBJ并处理
  let objProcessor: ObjProcessor
  {
    let responseData: string = ''
    await axios.get('./model/normed/pony.obj').then((res: any) => {
      responseData = res.data
    })
    objProcessor = new ObjProcessor(responseData)
  }

  // 把各个面的组成推进去
  objProcessor.fs.forEach(face => {
    face.forEach(vOfFace => {
      let subscript = vOfFace - 1
      vertices.push(objProcessor.vs[subscript]) // xyzxyzxyz
    })
  })
  
  helper.useBuffer(vBuffer)
  helper.sendDataToBuffer(flatten(vertices))
  helper.vertexSettingMode(vBuffer, 'aPosition', 3)

  helper.setUniformColor('uColor', [0, 0, 0])
  helper.drawArrays(gl.LINE_LOOP, 0, objProcessor.getEffectiveVertexCount())

}

main()