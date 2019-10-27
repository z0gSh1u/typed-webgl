// Vertex Shader

attribute vec4 aPosition;

attribute vec2 aTexCoord;
varying vec2 vTexCoord;

// transformation matrix under world coordinate system
uniform mat4 uWorldMatrix;
// transformation matrix under self coordinate system
uniform mat4 uModelMatrix;

void main() {

	// vertex position
	gl_Position = uWorldMatrix * uModelMatrix * aPosition;

	vTexCoord = aTexCoord;
	
}