// Vertex Shader

attribute vec4 aPosition;

//attribute vec4 aColor;
//varying vec4 vColor;

uniform mat4 uWorldMatrix; // transformation matrix under world coordinate system
uniform mat4 uModelMatrix; // transformation matrix under self coordinate system

void main() {
	// vertex position
	gl_Position = uWorldMatrix * uModelMatrix * aPosition;
	//vColor = aColor;
}