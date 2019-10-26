// Vertex Shader

attribute vec3 aPosition;

//attribute vec4 aColor;
//varying vec4 vColor;

uniform mat4 uWorldMatrix;
uniform mat4 uMVMatrix;

void main() {
	// vertex position
	gl_Position.x = aPosition.x;
	gl_Position.y = aPosition.y;
	gl_Position.z = aPosition.z;
	gl_Position.w = 1.0;
	//vColor = aColor;
}