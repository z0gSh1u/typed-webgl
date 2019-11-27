// Vertex shader for background rendering.

attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {

  gl_Position.xy = aPosition.xy;
  gl_Position.zw = vec2(0.99, 1.0); // 0.99 so that the whole Pony can be rendered.

  vTexCoord = aTexCoord;

}