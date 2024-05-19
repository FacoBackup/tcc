precision highp float;

uniform float time;
uniform float maxValue;
uniform vec2 iResolution;
uniform vec3 cameraPosition;

out vec4 fragColor;

float dot2(in vec2 v) { return dot(v, v); }
float dot2(in vec3 v) { return dot(v, v); }
float ndot(in vec2 a, in vec2 b) { return a.x * b.x - a.y * b.y; }

float sdPlane(vec3 p)
{
    return p.y;
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b)
{
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float ssQ(vec3 p)
{
    float px = p.x;
    float pz = p.z;
    float distanceXZ = abs(pz - px * px) / sqrt(1.0 + 4.0 * px * px);
    return distanceXZ;
}

float map(in vec3 pos) {
    vec3 origin = vec3(0.0, 0.25, 0.0);
    return sdBox(pos - origin, vec3(.2));
}

vec2 raycast(in vec3 ro, in vec3 rd)
{
    vec2 res = vec2(-1.0, -1.0);

    float color = 16.9;

    float t = 1.;
    for (int i = 0; i < 75; i++)
    {
        float h = map(ro + rd * t);
        if (abs(h) < (0.0001 * t))
        {
            res = vec2(t,color);
            break;
        }
        t += h;
    }


    return res;
}


vec3 render(in vec3 ro, in vec3 rd, in vec3 rdx, in vec3 rdy)
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
    vec3 ta = vec3(1.);
    vec3 ro = cameraPosition + vec3(4.5 * cos(0.1 * time + 7.0 ), 2.2, 4.5 * sin(0.1 * time + 7.0));
    mat3 ca = setCamera(ro, cameraPosition, 0.0);


    vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;


    // focal length
    const float fl = 2.5;

    // ray direction
    vec3 rd = ca * normalize(vec3(p, fl));

    // ray differentials
    vec2 px = (2.0 * (gl_FragCoord.xy + vec2(1.0, 0.0)) - iResolution.xy) / iResolution.y;
    vec2 py = (2.0 * (gl_FragCoord.xy + vec2(0.0, 1.0)) - iResolution.xy) / iResolution.y;
    vec3 rdx = ca * normalize(vec3(px, fl));
    vec3 rdy = ca * normalize(vec3(py, fl));

    // render
    vec3 col = render(ro, rd, rdx, rdy);

    // gamma
    col = pow(col, vec3(0.4545));
    fragColor = vec4(col, 1.0);
}