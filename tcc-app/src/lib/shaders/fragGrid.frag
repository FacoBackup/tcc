precision highp float;

uniform float scale;
uniform float maxValue;
uniform vec2 iResolution;
in vec3 tPosition;
out vec4 fragColor;


bool inRange(float val) {
    return val < .1 && val > -.1;
}

void main() {
    fragColor = vec4(0.);
    float modX = mod(abs(tPosition.x * 2. ), 2.);
    float modY = mod(abs(tPosition.z * 2.), 2.);

    if (inRange(modX)) {
        fragColor = vec4(1.);
        if(inRange(tPosition.x)){
            fragColor = vec4(1., 0., 0., 1.);
        }else if(!inRange(modX - modY)){
            discard;
        }
    }
    if (inRange(modY)) {
        fragColor = vec4(1.);
        if(inRange(tPosition.z)){
            fragColor = vec4(0., 1., 0., 1.);
        }else if(!inRange(modX - modY)){
            discard;
        }
    }

    if (fragColor.a == 0.) discard;
}