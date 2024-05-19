layout (location = 0) in vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float time;
uniform float scale;
out vec3 tPosition;

float getFunctionValue(float x, float z) {
    return cos(x + time) + sin(z + time);
}

void main() {
    tPosition = position;
    tPosition.y = getFunctionValue(tPosition.x * scale, tPosition.z * scale);

    gl_Position = projectionMatrix * viewMatrix * vec4(tPosition, 1.);
}