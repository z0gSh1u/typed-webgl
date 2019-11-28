// Vertex shader for background rendering.

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying highp vec2 vTexCoord;

void main() {

  gl_Position.xyz = aPosition.xyz;
  gl_Position.w = 1.0;  
  vTexCoord = aTexCoord;

}