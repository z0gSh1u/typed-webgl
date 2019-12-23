precision highp float;

varying vec3 vFragPos;
varying vec3 vFragNormal;

uniform samplerCube texMap;
uniform vec3 uSightLine;

void main() {
  vec3 viewDir = normalize(vFragPos - uSightLine);
  vec3 reflectDir = reflect(viewDir, normalize(vFragNormal));
  gl_FragColor = textureCube(texMap, reflectDir);
}