precision highp float;

uniform float scale;
uniform float time;
uniform float maxValue;
uniform vec2 iResolution;
uniform bool drawComplete;
in vec3 tPosition;
out vec4 fragColor;

bool inRange(float val) {
    return val < .1 && val > -.1;
}
void main() {

    bool isXInteger = inRange(mod(abs(tPosition.x * scale), 2.));
    float modY = mod(abs(tPosition.z * scale), 2.);
    if (drawComplete) {
        fragColor = vec4(vec3(abs(tPosition.y) * scale), .85);
    }
    if (inRange(abs(tPosition.z - tPosition.x))) {
        fragColor.xyz = vec3(1., 0., 0.);
        fragColor.w = 1.;
    }
}