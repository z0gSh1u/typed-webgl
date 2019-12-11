precision mediump float;
uniform samplerCube uSkyBox;
uniform mat4 uProjectionWorldMatrixInv;
varying vec4 vPosition;
void main() {
  vec4 t = uProjectionWorldMatrixInv * vPosition;
  gl_FragColor = textureCube(uSkyBox, normalize(t.xyz / t.w));
}