varying vec3 R;
attribute vec3 vPoition;
attribute vec4 Normal;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uWorldMatrix;

void main() {
  vec4 pos = vec4(vPoition, 1.0);
  vec4 eyePos = uWorldMatrix * pos;
  vec4 N = uWorldMatrix * Normal;
  R = reflect(eyePos.xyz, N.xyz);
  gl_Position =uProjectionMatrix * uWorldMatrix * uModelMatrix * pos;
}