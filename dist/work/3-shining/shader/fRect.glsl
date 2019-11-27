// Fragment shader for background rendering.

varying highp vec2 vTexCoord;
uniform sampler2D uSampler;

void main() {

  gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));

}