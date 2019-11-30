// Vertex shader for background rendering.

attribute vec3 aPosition;

uniform mat4 uMatrix;

void main() {

  vec4 pos = vec4(aPosition, 1.0);
  gl_Position = uMatrix * pos;

}