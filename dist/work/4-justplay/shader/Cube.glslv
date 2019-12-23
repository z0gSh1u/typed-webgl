attribute vec3 aPoition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uWorldMatrix;
uniform mat4 uModelInvTransMatrix;

varying vec3 vFragPos;
varying vec3 vFragNormal;

void main() {
  vec4 pos = vec4(aPoition, 1.0);
  gl_Position = uProjectionMatrix * uWorldMatrix * uModelMatrix * pos;
  vFragPos = vec3(uModelMatrix * pos);
  mat3 normalMatrix = mat3(uModelInvTransMatrix);
  vFragNormal = normalMatrix * aNormal;
}