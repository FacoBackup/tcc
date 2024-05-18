export default function createBuffer(gl: WebGL2RenderingContext, type: number, data: Float32Array | Uint32Array, renderingType : number= gl.STATIC_DRAW) {
    if (!data) {
        return null
    }
    const buffer = gl.createBuffer()
    gl.bindBuffer(type, buffer)
    gl.bufferData(type, data, renderingType)
    return buffer
}