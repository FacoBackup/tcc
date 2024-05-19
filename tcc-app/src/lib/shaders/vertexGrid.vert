layout (location = 0) in vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float time;
out vec3 tPosition;

void main() {
    tPosition = position;
    gl_Position =  projectionMatrix * viewMatrix  * vec4(tPosition, 1.);
}