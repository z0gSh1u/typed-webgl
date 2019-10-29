// Vertex Shader

attribute vec4 aPosition;

attribute vec2 aTexCoord;
varying vec2 vTexCoord;

// transformation matrix under world coordinate system
uniform mat4 uWorldMatrix;
// transformation matrix under self coordinate system
uniform mat4 uModelMatrix;
// extra matrix for some specified effect of some drawingObject
uniform mat4 uExtraMatrix;

void main() {

	// vertex position
	gl_Position = uWorldMatrix * uModelMatrix * uExtraMatrix * aPosition;

	vTexCoord = aTexCoord;
	
}