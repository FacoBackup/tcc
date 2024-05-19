layout (location = 0) in vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float time;
out vec3 tPosition;

float getFunctionValue(float x, float z) {
    return pow(x, 2.) + pow(z, 2.);
}

void main() {
    tPosition = position;
    tPosition.y = getFunctionValue(tPosition.x, tPosition.z);

    gl_Position.xyz = vec3( projectionMatrix * viewMatrix  * vec4(tPosition, 1.));
    gl_Position.w = 1.;
}