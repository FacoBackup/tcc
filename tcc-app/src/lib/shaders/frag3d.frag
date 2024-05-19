precision highp float;

uniform float time;
uniform float maxValue;
uniform vec2 iResolution;
in vec3 tPosition;
out vec4 fragColor;


void main() {
    if ((tPosition.x < .1 && tPosition.x > -.1) || (tPosition.z < .1 && tPosition.z > -.1)) {
        fragColor = vec4(1.);
    } else {
        fragColor = vec4(tPosition, 1.);
    }
}