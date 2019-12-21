// Fragment Shader

precision mediump float;

uniform vec4 uColor;

varying vec4 vLight;

void main() {

  gl_FragColor = uColor * vLight;

}