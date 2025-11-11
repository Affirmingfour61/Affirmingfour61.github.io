precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// Varying received from vertex shader
varying vec2 vTexcoords;

void main(void) {
    // To verify texture coordinates visually (for todo #3):
    // gl_FragColor = vec4(vTexcoords.x, vTexcoords.y, 0.0, 1.0);

    // For normal texturing and transparency:
    vec4 texColor = texture2D(uTexture, vTexcoords);
    gl_FragColor = vec4(texColor.rgb, uAlpha);
}
