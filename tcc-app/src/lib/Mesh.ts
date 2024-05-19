import VertexBuffer from "./VertexBuffer.ts";
import {MeshProps} from "../Models.ts";
import createBuffer from "./create-buffer.ts";


export default class Mesh {
    private static activeMesh: Mesh | undefined;

    readonly verticesQuantity: number
    readonly trianglesQuantity: number
    readonly VAO: WebGLVertexArrayObject
    readonly indexVBO: WebGLBuffer
    readonly vertexVBO: VertexBuffer
    readonly normalVBO?: VertexBuffer
    readonly uvVBO?: VertexBuffer
    gl: WebGL2RenderingContext

    constructor(gl: WebGL2RenderingContext, attributes: MeshProps) {
        this.gl = gl
        const {
            vertices,
            indices,
            normals,
            uvs,
        } = attributes

        const l = indices.length
        this.trianglesQuantity = l / 3
        this.verticesQuantity = l

        this.VAO = this.gl.createVertexArray() as WebGLVertexArrayObject
        this.gl.bindVertexArray(this.VAO)

        this.indexVBO = createBuffer(gl, this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices)) as WebGLBuffer
        this.vertexVBO = new VertexBuffer(gl, 0, new Float32Array(vertices), this.gl.ARRAY_BUFFER, 3, this.gl.FLOAT, false, undefined, 0)

        if (uvs && uvs.length > 0)
            this.uvVBO = new VertexBuffer(gl, 1, new Float32Array(uvs), this.gl.ARRAY_BUFFER, 2, this.gl.FLOAT, false, undefined, 0)

        if (normals && normals.length > 0)
            this.normalVBO = new VertexBuffer(gl, 2, new Float32Array(normals), this.gl.ARRAY_BUFFER, 3, this.gl.FLOAT, false, undefined, 0)

        this.gl.bindVertexArray(null)
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)

    }

    bindAllResources() {
        const last = Mesh.activeMesh
        if (last === this)
            return
        Mesh.activeMesh = this
        this.gl.bindVertexArray(this.VAO)
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO)
        this.vertexVBO.enable()
        if (this.normalVBO)
            this.normalVBO.enable()
        if (this.uvVBO)
            this.uvVBO.enable()
    }

    finish() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
        this.vertexVBO.disable()

        if (this.uvVBO)
            this.uvVBO.disable()
        if (this.normalVBO)
            this.normalVBO.disable()

        this.gl.bindVertexArray(null)
        Mesh.activeMesh = undefined
    }

    draw() {
        this.bindAllResources()
        this.gl.drawElements(this.gl.TRIANGLES, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
        this.finish()
    }
}