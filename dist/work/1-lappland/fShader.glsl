// Fragment Shader

precision mediump float;

varying vec4 vColor;

// uniform vec4 uColor;

void main() {
  gl_FragColor = vColor;
}