precision mediump float;

// Uniforms
uniform vec3 u_firstColor;
uniform vec3 u_secondColor;

// Varying
varying vec3 v_position;

void main() {
    vec3 color = mix(u_firstColor, u_secondColor, v_position.z);
    gl_FragColor = vec4(color,1.0);
}