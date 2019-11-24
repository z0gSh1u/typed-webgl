// Fragment Shader

precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;

varying vec4 vLight;

void main() {

  gl_FragColor = texture2D(uTexture, vTexCoord) + vLight;

}