attribute vec4 aPosition;
varying vec4 vPosition;
void main() {
  vPosition = aPosition;
  gl_Position = aPosition;
}