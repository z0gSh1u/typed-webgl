precision mediump float;

varying vec3 vPosition;
uniform samplerCube cubeTexture;

void main(){
  gl_FragColor = textureCube(cubeTexture, normalize(vPosition.xyz));
}