import VertexBuffer from "./VertexBuffer.ts";
import {MeshProps} from "../Models.ts";
import createBuffer from "./create-buffer.ts";


export default class Mesh {
    private static activeMesh: Mesh | undefined;

    readonly verticesQuantity: number
    readonly trianglesQuantity: number
    readonly id: string
    readonly VAO: WebGLVertexArrayObject
    readonly indexVBO: WebGLBuffer
    readonly vertexVBO: VertexBuffer
    readonly normalVBO?: VertexBuffer
    readonly uvVBO?: VertexBuffer
    #lastUsedElapsed = 0
    gl: WebGL2RenderingContext

    get lastUsedElapsed() {
        return this.#lastUsedElapsed
    }

    constructor(gl: WebGL2RenderingContext, attributes: MeshProps) {
        this.gl = gl
        const {
            id = crypto.randomUUID(),
            vertices,
            indices,
            normals,
            uvs,
        } = attributes

        this.id = id
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

    static finishIfUsed() {
        const lastUsed = Mesh.activeMesh
        if (lastUsed != null)
            lastUsed.finish()
    }

    bindEssentialResources() {
        const last = Mesh.activeMesh
        if (last === this)
            return

        Mesh.activeMesh = this
        this.gl.bindVertexArray(this.VAO)
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO)
        this.vertexVBO.enable()

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

    simplifiedDraw() {

        this.bindEssentialResources()
        this.gl.drawElements(this.gl.TRIANGLES, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
    }

    draw() {
        this.bindAllResources()
        this.gl.drawElements(this.gl.TRIANGLES, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
    }

    drawInstanced(quantity: number) {
        this.bindAllResources()
        this.gl.drawElementsInstanced(this.gl.TRIANGLES, this.verticesQuantity, this.gl.UNSIGNED_INT, 0, quantity)
    }

    drawLineLoop() {
        this.bindEssentialResources()
        this.gl.drawElements(this.gl.LINE_LOOP, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
    }

    drawTriangleStrip() {
        this.bindEssentialResources()
        this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
    }

    drawTriangleFan() {
        this.bindEssentialResources()
        this.gl.drawElements(this.gl.TRIANGLE_FAN, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
    }

    drawLines() {
        this.bindEssentialResources()
        this.gl.drawElements(this.gl.LINES, this.verticesQuantity, this.gl.UNSIGNED_INT, 0)
    }
}