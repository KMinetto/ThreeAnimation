precision mediump float;

uniform float u_time;

varying vec2 v_uv;

void main()
{
    float rot = 0.086 * u_time;
    vec2 uv = v_uv;

    for (float i = 0.0; i < 15.0; i++)
    {
        //uv.x = abs(uv.x);
        uv -= 0.5;
        uv *= 1.1;

        uv *= mat2(-cos(rot), sin(rot),
                    -sin(rot), -cos(rot));
        //uv.x = fract(uv.x)*0.6;
        uv.x += cos(uv.y);
        //uv.y = fract(uv.y);
        uv.y -= cos(uv.x);
        //uv = vec2(fract(uv.x - uv.y), uv.y);

    }
    uv = normalize(uv);
    uv = vec2(1.0, 1.0) - uv;

    // Define colors
    vec3 color1 = vec3(203.0 / 255.0, 206.0 / 255.0, 224.0 / 255.0); // #cbcee0
    vec3 color2 = vec3(164.0 / 255.0, 166.0 / 255.0, 217.0 / 255.0); // #a4a6d9
    vec3 color3 = vec3(222.0 / 255.0, 193.0 / 255.0, 239.0 / 255.0); // #dec1ef
    vec3 color4 = vec3(188.0 / 255.0, 146.0 / 255.0, 217.0 / 255.0); // #bc92d9
    vec3 color5 = vec3(232.0 / 255.0, 194.0 / 255.0, 236.0 / 255.0); // #e8c2ec
    vec3 color6 = vec3(191.0 / 255.0, 175.0 / 255.0, 229.0 / 255.0); // #bfafe5
    vec3 color7 = vec3(152.0 / 255.0, 160.0 / 255.0, 222.0 / 255.0); // #98a0de

    // Blend colors based on UV coordinates
    vec3 finalColor = mix(color1, color2, uv.x * uv.y);
    finalColor = mix(finalColor, color3, uv.x * uv.y);
    finalColor = mix(finalColor, color4, uv.x * uv.y);
    finalColor = mix(finalColor, color5, uv.x * uv.y);
    finalColor = mix(finalColor, color6, uv.x * uv.y);
    finalColor = mix(finalColor, color7, uv.x * uv.y);

    // Assign the final color to gl_FragColor
    gl_FragColor = vec4(finalColor, 1.0);
}