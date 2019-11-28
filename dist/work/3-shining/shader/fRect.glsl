// Fragment shader for background rendering.

precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;

void main() {

  vec4 color = texture2D(uTexture, vTexCoord);
  gl_FragColor = color;
  
}