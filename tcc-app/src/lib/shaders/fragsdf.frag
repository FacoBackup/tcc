precision highp float;

uniform float time;
uniform float maxValue;
uniform vec2 iResolution;
uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

out vec4 fragColor;

float dot2(in vec2 v) { return dot(v, v); }
float dot2(in vec3 v) { return dot(v, v); }
float ndot(in vec2 a, in vec2 b) { return a.x * b.x - a.y * b.y; }

float sdBox(vec3 p, vec3 b)
{
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float lineSegment(in vec3 p, in vec3 a, in vec3 b) {
    vec3 ba = b - a;
    vec3 pa = p - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    return length(pa - h * ba);
}

float map(in vec3 pos) {
    return lineSegment(pos, vec3(0., 1., 0.), vec3(0., 2., 1.)) - .1;
}

vec2 raycast(in vec3 ro, in vec3 rd) {
    vec2 res = vec2(-1.0, -1.0);
    float color = 16.9;
    float t = 1.;
    for (int i = 0; i < 75; i++) {
        float h = map(ro + rd * t);
        if (abs(h) < (0.0001 * t))
        {
            res = vec2(t, color);
            break;
        }
        t += h;
    }
    return res;
}


vec3 render(in vec3 ro, in vec3 rd)
{
    vec3 col = vec3(0.);
    // raycast scene
    vec2 res = raycast(ro, rd);
    float t = res.x;
    float m = res.y;
    if (m > -0.5)
    {
        vec3 pos = ro + t * rd;
        vec3 nor = vec3(0.0, 1.0, 0.0);
        vec3 ref = reflect(rd, nor);

        // material
        col = 0.2 + 0.2 * sin(m * 2.0 + vec3(0.0, 1.0, 2.0));
        float ks = 1.0;
        col = mix(col, vec3(0.7, 0.7, 0.9), 1.0 - exp(-0.0001 * t * t * t));
    }

    return vec3(clamp(col, 0.0, 1.0));
}

mat3 setCamera(in vec3 ro, in vec3 ta, float cr)
{
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(sin(cr), cos(cr), 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = (cross(cu, cw));
    return mat3(cu, cv, cw);
}



void main()
{
    vec3 rayOrigin = cameraPosition;
    mat4 ca = projectionMatrix * viewMatrix;

    vec3 ta = vec3(0.);
    vec3 ww = normalize(ta - cameraPosition);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = normalize(cross(uu, ww));


    vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    const float fl = 2.5;
    vec3 rayDirection = normalize(p.x * uu + p.y * vv + fl * ww);

    // render
    vec3 col = render(rayOrigin, rayDirection);

    if (length(col) < .1) discard;
    // gamma
    col = pow(col, vec3(0.4545));

    fragColor = vec4(col, 1.0);
}