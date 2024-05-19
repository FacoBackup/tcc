precision highp float;

#define xAxisColor vec3(1., 0., 0.)
#define yAxisColor vec3(0., 1., 0.)

uniform float time;
uniform float maxValue;
uniform vec2 iResolution;
out vec4 fragColor;


float functionValue(float num) {
    return pow(num, 2.);
}

vec2 sdf(const in vec2 p) {
    float xValue = abs(functionValue(p.x) - p.y);
    float offsetedXValue = functionValue(p.x + .5) - functionValue(p.x - .5);

    float yValue = abs(functionValue(p.y) - p.x);
    float offsetedYValue = functionValue(p.y + .5) - functionValue(p.y - .5);

    float gXValue = 1.5 + pow(offsetedXValue, 2.);
    float gYValue = 1.5 + pow(offsetedYValue, 2.);

    return vec2(
        float(smoothstep(0., .13, xValue / sqrt(gXValue))),
        float(smoothstep(0., .13, yValue / sqrt(gYValue)))
    );
}

vec2 draw(const in vec2 p, const in float zoom, const in float thickness) {
    vec2 rz = sdf(p);
    rz *= (1. / thickness) / sqrt(zoom / iResolution.y);
    rz = 1. - clamp(rz, 0., 1.);
    if (p.x > maxValue) {
        rz.x = 0.;
    }
    if (p.y > maxValue) {
        rz.y = 0.;
    }
    return rz;
}

void main() {
    float zoom = 10.;
    float screenAspectRatio = iResolution.x / iResolution.y;
    vec2 uvCoords = gl_FragCoord.xy / iResolution.xy;
    uvCoords.x = (uvCoords.x * screenAspectRatio) + (1. - screenAspectRatio) * .5;
    vec2 scaledUVCoord = uvCoords * zoom - 0.5 * zoom;

    vec2 fValue = draw(scaledUVCoord, zoom, 2.);
    vec3 xAxisValue = (fValue.x * (1. - xAxisColor));
    vec3 yAxisValue = (fValue.y * (1. - yAxisColor));
    fragColor = vec4(vec3(1.) - xAxisValue - yAxisValue, 1.);

    float xSize = zoom / iResolution.x;
    float ySize = zoom / iResolution.y;
    if ((scaledUVCoord.x < xSize && scaledUVCoord.x > -xSize) || (scaledUVCoord.y < ySize && scaledUVCoord.y > -ySize)) {
        fragColor = vec4(0.);
    }
}
