varying vec3 R;
attribute vec4 vPoition;
attribute vec4 Normal;

uniform mat4 loca;


uniform mat4 ModelView;
uniform vec3 theta;


void main() {
  vec3 angles = radians(theta);
  vec3 c = cos(angles);
  vec3 s = sin(angles);

  mat4 rx = mat4(1.0, 0.0, 0.0, 0.0,
                 0.0, c.x, s.x, 0.0,
                 0.0,-s.x, c.x, 0.0,
                 0.0, 0.0, 0.0, 1.0);
  mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 s.y, 0.0, c.y, 0.0,
                 0.0, 0.0, 0.0, 1.0);
  mat4 rz = mat4(c.z, -s.z,0.0, 0.0,
                 s.z, c.z, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 0.0, 0.0, 0.0, 1.0);

  mat4 ModelView = rz * ry * rx;
  vec4 eyePos = ModelView * vPoition;
  vec4 N = ModelView * Normal;
  R = reflect(eyePos.xyz, N.xyz);
  gl_Position = ModelView * vPoition * loca;
}