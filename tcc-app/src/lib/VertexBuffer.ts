import createBuffer from "./create-buffer.ts";

export default class VertexBuffer {
    private readonly id: WebGLBuffer
    private readonly stride: number
    private readonly index: number
    private readonly type: number
    private readonly size: number
    private readonly normalized: boolean
    length = 0
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, index: number, data: any, type: number, size: number, dataType: number, normalized?: boolean, renderingType?: number, stride?: number) {
        this.id = createBuffer(gl, type, data, renderingType) as WebGLBuffer
        this.gl = gl
        this.gl.vertexAttribPointer(
            index,
            size,
            dataType,
            !!normalized,
            stride || 0,
            0)
        this.gl.bindBuffer(type, null)
        this.stride = stride || 0
        this.index = index
        this.type = type
        this.size = size
        this.normalized = !!normalized
        this.length = data.length
    }

    enable() {
        this.gl.enableVertexAttribArray(this.index)
        this.gl.bindBuffer(this.type, this.id)
        this.gl.vertexAttribPointer(this.index, this.size, this.type, this.normalized, this.stride, 0)
    }

    disable() {
        this.gl.disableVertexAttribArray(this.index)
        this.gl.bindBuffer(this.type, null)
    }

    delete() {
        this.gl.deleteBuffer(this.id)
    }
}