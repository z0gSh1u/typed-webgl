// Vertex Shader

// vertex position
attribute vec4 aPosition;
// normal vector
attribute vec4 aNormal;
// texture using
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
// transformation matrix under world coordinate system
uniform mat4 uWorldMatrix;
// transformation matrix under self coordinate system
uniform mat4 uModelMatrix;
// transformation matrix for toushi
uniform mat4 uProjectionMatrix;
// light position
uniform vec4 uLightPosition;
// specular shiness
uniform float uShiness;
// Phong model parameters
uniform vec4 uAmbientProduct, uDiffuseProduct, uSpecularProduct;
// convery light result to fShader
varying vec4 vLight;

uniform mat3 uWorldMatrixTransInv;

void main() {

	// vertex position
	vec3 posToWorld = (uWorldMatrix * aPosition).xyz;
	// light calculation
	vec3 lightPos = uLightPosition.xyz;
	vec3 L = normalize(lightPos - posToWorld);
	vec3 E = -normalize(posToWorld);
	vec3 H = normalize(L + E);
	vec4 NN = aNormal;
	
	vec3 N = normalize((uWorldMatrixTransInv * NN.xyz).xyz); // split this mat?
	vec4 ambient = uAmbientProduct;
	float Kd = max(dot(L, N), 0.0);
	vec4 diffuse = Kd * uDiffuseProduct;
	float Ks = pow(max(dot(N, H), 0.0), uShiness);
	vec4 specular = Ks * uSpecularProduct;
	if (dot(L, N) < 0.0) {
		// can't see
		specular = vec4(0.0, 0.0, 0.0, 1.0);
	}

	gl_Position = uProjectionMatrix * uWorldMatrix * uModelMatrix * aPosition;

	vTexCoord = aTexCoord;
	vLight = vec4((ambient + diffuse + specular).rgb, 1.0);
	
}