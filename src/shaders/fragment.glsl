precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

const int noiseSwirlSteps = 2;
const float noiseSwirlValue = 1.0;
const float noiseSwirlStepValue = noiseSwirlValue / float(noiseSwirlSteps);

const float noiseScale = 2.0;
const float noiseTimeScale = 0.1;

float simplex(vec3 v);
float getNoise(vec3 v);

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float noise = getNoise(vec3(uv * noiseScale, u_time * noiseTimeScale));
    noise = noise * noise * noise * noise * 2.0;

    vec3 color1 = vec3(172.0 / 255.0, 224.0 / 255.0, 245.0 / 255.0); // #ACE0F5
    vec3 color2 = vec3(149.0 / 255.0, 184.0 / 255.0, 240.0 / 255.0); // #95B8F0
    vec3 color3 = vec3(179.0 / 255.0, 182.0 / 255.0, 233.0 / 255.0); // #B3B6E9
    vec3 color4 = vec3(242.0 / 255.0, 254.0 / 255.0, 242.0 / 255.0); // #F2FEF2
    vec3 color5 = vec3(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0); // #FFFFFF

    vec3 finalColor;
    if (noise < 0.16) {
        finalColor = mix(color1, color2, noise * 6.25);
    } else if (noise < 0.32) {
        finalColor = mix(color2, color3, (noise - 0.16) * 6.25);
    } else if (noise < 0.48) {
        finalColor = mix(color3, color4, (noise - 0.32) * 6.25);
    } else if (noise < 0.64) {
        finalColor = mix(color4, color5, (noise - 0.48) * 6.25);
    } else {
        finalColor = mix(color5, color1, (noise - 0.64) * 6.25);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}

float fbm3(vec3 v) {
    float result = simplex(v);
    result += simplex(v * 2.0) / 2.0;
    result += simplex(v * 4.0) / 4.0;
    result /= (1.0 + 1.0 / 2.0 + 1.0 / 4.0);
    return result;
}

float fbm5(vec3 v) {
    float result = simplex(v);
    result += simplex(v * 2.0) / 2.0;
    result += simplex(v * 4.0) / 4.0;
    result += simplex(v * 8.0) / 8.0;
    result += simplex(v * 16.0) / 16.0;
    result /= (1.0 + 1.0 / 2.0 + 1.0 / 4.0 + 1.0 / 8.0 + 1.0 / 16.0);
    return result;
}

float getNoise(vec3 v) {
    for (int i = 0; i < noiseSwirlSteps; i++) {
        v.xy += vec2(fbm3(v), fbm3(vec3(v.xy, v.z + 1000.0))) * noiseSwirlStepValue;
    }
    return fbm5(v) / 2.0 + 0.5;
}

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float simplex(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    vec3 ns = 1.0 / 7.0 * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}