precision highp float;

#define xAxisColor vec3(1., 0., 0.)
#define yAxisColor vec3(0., 1., 0.)

uniform float time;
uniform float maxValue;
uniform vec2 iResolution;
out vec4 fragColor;

float functionValue(float num) {
    return cos(num);
}

float lineSegment(in vec2 p, in vec2 a, in vec2 b) {
    vec2 ba = b - a;
    vec2 pa = p - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    return length(pa - h * ba);
}

void main() {
    float zoom = 7.5;
    float screenAspectRatio = iResolution.x / iResolution.y;
    vec2 uvCoords = gl_FragCoord.xy / iResolution.xy;
    uvCoords.x = (uvCoords.x * screenAspectRatio) + (1. - screenAspectRatio) * .5;
    vec2 scaledUVCoord = uvCoords * zoom - 0.5 * zoom;

    vec3 color = vec3(0.);
    vec2 v1 = vec2(0., .0);
    vec2 v2 = vec2(0., .0);
    float thickness = .001;
    int samples = 100;
    int spacing = 20;
    float offset = 10.;
    float lastX = -offset;
    float lastY = functionValue(lastX);

    for (int i = 0; i < samples; i++) {
        v1.x = lastX;
        v1.y = lastY;
        v2.x = float(i) / float(samples / spacing) - offset;
        v2.y = functionValue(v1.x);
        float d = lineSegment(scaledUVCoord, v1, v2) - thickness;
        color = mix(color, vec3(1.), 1. - smoothstep(.0, .015, abs(d)));
        lastX = v2.x;
        lastY = v2.y;
    }

    fragColor = vec4(color, 1.);
}
