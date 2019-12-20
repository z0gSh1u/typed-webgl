attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection * u_view * u_world * a_position;

  // send the view position to the fragment shader
  v_worldPosition = (u_world * a_position).xyz;

  // orient the normals and pass to the fragment shader
  v_worldNormal = mat3(u_world) * a_normal;
}