// Vertex Shader

attribute vec2 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

void main() {
	// vertex position
	gl_Position.x = aPosition.x;
	gl_Position.y = aPosition.y;
	gl_Position.z = 0.0;
	gl_Position.w = 1.0;

	// convey fragment color to fShader
	vColor = aColor;
}