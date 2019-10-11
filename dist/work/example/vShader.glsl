// Verticle shader. Determine how to draw a vertex.

attribute vec4 vPosition; // attribute is like `var`
// uniform float theta; // uniform is like `const`

void main() {
    gl_Position.x = vPosition.x;
    gl_Position.y = vPosition.y;
    gl_Position.z = 0.0;
    gl_Position.w = 1.0;
}