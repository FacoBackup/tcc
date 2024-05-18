const QUAD = {
    id: "QUAD",
    "indices": [0, 1, 3, 0, 3, 2],
    "vertices": [-1, -1, -4.371138828673793e-8, 1, -1, -4.371138828673793e-8, -1, 1, 4.371138828673793e-8, 1, 1, 4.371138828673793e-8]
}

const GLSLTypes: Record<string, string> = {
    vec2: "uniform2fv",
    vec3: "uniform3fv",
    vec4: "uniform4fv",
    mat3: "uniformMatrix3fv",
    mat4: "uniformMatrix4fv",
    float: "uniform1f",
    int: "uniform1i",
    sampler2D: "sampler2D",
    samplerCube: "cubemap",
    ivec2: "uniform2iv",
    ivec3: "uniform3iv",
    bool: "uniform1i"
}

enum GLSLType {
    vec2 = "vec2",
    vec3 = "vec3",
    vec4 = "vec4",
    mat3 = "mat3",
    mat4 = "mat4",
    float = "float",
    int = "int",
    sampler2D = "sampler2D",
    samplerCube = "samplerCube",
    ivec2 = "ivec2",
    ivec3 = "ivec3",
    bool = "bool"
}

interface MeshProps {
    id?: string,
    vertices: number[] | Float32Array,
    indices: number[] | Float32Array,
    normals?: number[] | Float32Array,
    uvs?: number[] | Float32Array,
    tangents?: number[] | Float32Array,
    maxBoundingBox?: number[],
    minBoundingBox?: number[]

}

export {
    GLSLType,
    QUAD,
}
export type {MeshProps}
export default GLSLTypes