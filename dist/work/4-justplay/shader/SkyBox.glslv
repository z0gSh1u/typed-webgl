// Vertex shader for SkyBox rendering.

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

uniform mat4 uPerspectiveMatrix;
uniform mat4 uWorldMatrix;

void main() {

  gl_Position = uPerspectiveMatrix * uWorldMatrix * vec4(aPosition, 1.0);

  vTexCoord = aTexCoord;

}