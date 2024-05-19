import Mesh from "./Mesh.ts";

export default function generateSurface(gl: WebGL2RenderingContext, vertexCount: number, asLine: boolean): Mesh {
    const count = vertexCount ** 2
    const vertices = new Float32Array(count * 3),
        indices = new Float32Array(6 * (vertexCount - 1) * vertexCount)
    const SCALE = 10
    const OFFSET = SCALE/2
    let vertexPointer = 0

    for (let i = 0; i < vertexCount; i++) {
        for (let j = 0; j < vertexCount; j++) {
            vertices[vertexPointer * 3] = asLine ? 1 : (j / (vertexCount - 1)) * SCALE - OFFSET
            vertices[vertexPointer * 3 + 1] = 0;
            vertices[vertexPointer * 3 + 2] = (i / (vertexCount - 1)) * SCALE  - OFFSET

            vertexPointer++
        }
    }


    let pointer = 0
    for (let gz = 0; gz < vertexCount - 1; gz++) {
        for (let gx = 0; gx < vertexCount - 1; gx++) {
            const topLeft = (gz * vertexCount) + gx,
                topRight = topLeft + 1,
                bottomLeft = ((gz + 1) * vertexCount) + gx,
                bottomRight = bottomLeft + 1


            indices[pointer++] = topLeft
            indices[pointer++] = bottomLeft
            indices[pointer++] = topRight
            indices[pointer++] = topRight
            indices[pointer++] = bottomLeft
            indices[pointer++] = bottomRight
        }
    }

    return new Mesh(gl, {vertices, indices})
}