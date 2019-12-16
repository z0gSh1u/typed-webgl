// Vertex Shader

attribute vec2 aPosition;

void main() {
	// vertex position
	gl_Position.x = aPosition.x;
	gl_Position.y = aPosition.y;
	gl_Position.z = 0.5;
	gl_Position.w = 1.0;
}