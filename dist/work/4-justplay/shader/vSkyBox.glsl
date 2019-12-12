attribute vec3 aPosition;
varying vec3 vPosition;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
  vPosition = aPosition;
  vec4 mvPosition = mat4(mat3(modelViewMatrix)) * vec4(aPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
