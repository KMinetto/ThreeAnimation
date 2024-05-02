precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

varying vec2 v_uv;

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;

    for(int i=0; i<3; i++){
        uv += vec2(.37, -0.3); // Adjust the direction of the wave here
        uv = vec2(sin(uv.x*6.+uv.y*9.8)*.5+.5, cos(uv.y*6.68+uv.x*7.3)*.5*.5);
    }

    float x = smoothstep(.4, .9, sin(u_time * 0.5 + (uv.x-uv.y)*2.*3.1415)*.5+.5);
    vec3 col = mix(vec3(27./255., 20./255., 33./255.), vec3(225./255., 253./255., 249./255.), x);

    vec3 color1 = vec3(172.0 / 255.0, 224.0 / 255.0, 245.0 / 255.0); // #ACE0F5
    vec3 color2 = vec3(149.0 / 255.0, 184.0 / 255.0, 240.0 / 255.0); // #95B8F0
    vec3 color3 = vec3(179.0 / 255.0, 182.0 / 255.0, 233.0 / 255.0); // #B3B6E9
    vec3 color4 = vec3(242.0 / 255.0, 254.0 / 255.0, 242.0 / 255.0); // #F2FEF2
    vec3 color5 = vec3(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0); // #FFFFFF

    vec3 finalColor;
    if (x < 0.16) {
        finalColor = mix(color1, color2, x * 6.25);
    } else if (x < 0.32) {
        finalColor = mix(color2, color3, (x - 0.16) * 6.25);
    } else if (x < 0.48) {
        finalColor = mix(color3, color4, (x - 0.32) * 6.25);
    } else if (x < 0.64) {
        finalColor = mix(color4, color5, (x - 0.48) * 6.25);
    } else {
        finalColor = mix(color5, color1, (x - 0.64) * 6.25);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}