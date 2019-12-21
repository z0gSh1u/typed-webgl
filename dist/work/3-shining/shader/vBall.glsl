// Vertex shader for background rendering.

attribute vec3 aPosition;

uniform mat4 uWorldMat;
uniform mat4 uModelMat;

void main() {

  vec4 pos = vec4(aPosition, 1.0);
  gl_Position = uWorldMat * uModelMat * pos;

}