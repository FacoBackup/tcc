import Engine from "./Engine.ts";
import Shader from "./Shader.ts";
// @ts-ignore
import fragment from "./shaders/fragment.frag?raw"
// @ts-ignore
import frag3d from "./shaders/frag3d.frag?raw"
// @ts-ignore
import fragGrid from "./shaders/fragGrid.frag?raw"
// @ts-ignore
import vertex from "./shaders/vertex.vert?raw"
// @ts-ignore
import vertex3d from "./shaders/vertex3d.vert?raw"
// @ts-ignore
import vertexGrid from "./shaders/vertexGrid.vert?raw"

import Mesh from "./Mesh.ts";
import {GLSLType, QUAD} from "../Models.ts";
import CameraTracker from "./CameraTracker.ts";
import generateSurface from "./generate-surface.ts";

export default class Renderer {
    private readonly engine: Engine;
    private readonly quad: Mesh;
    public functionLimit: number = 100;
    public iResolution: Float32Array = new Float32Array([1000, 1000]);
    private readonly cameraTracker: CameraTracker;
    private readonly plane: Mesh;
    private shader2d: Shader;
    private shaderGrid: Shader;
    private shader3d: Shader;
    show2d = false;
    scale = 2;
    time = 0;

    constructor(engine: Engine) {
        this.engine = engine;
        const gl = this.engine.gl;
        this.shader2d = new Shader(gl, vertex, fragment)
        this.shader3d = new Shader(gl, vertex3d, frag3d)
        this.shaderGrid = new Shader(gl, vertexGrid, fragGrid)
        this.quad = new Mesh(gl, QUAD)
        gl.disable(gl.CULL_FACE)
        this.plane = generateSurface(gl, 600, false)
        this.cameraTracker = new CameraTracker(engine.canvas)
    }

    draw() {
        const gl = this.engine.gl;
        gl.viewport(0, 0, this.engine.canvas.width, this.engine.canvas.height)
        if (this.show2d) {
            this.shader2d.bind()
            this.shader2d.bindData(this.shader2d.uniforms.get("time") as WebGL2RenderingContext, this.engine.elapsed / 500., GLSLType.float)
            this.shader2d.bindData(this.shader2d.uniforms.get("maxValue") as WebGL2RenderingContext, this.functionLimit, GLSLType.float)
            this.shader2d.bindData(this.shader2d.uniforms.get("iResolution") as WebGL2RenderingContext, this.iResolution, GLSLType.vec2)
            this.quad.draw()
        } else {
            this.bindUniforms(this.shaderGrid)
            this.plane.draw()

            this.bindUniforms(this.shader3d)
            this.shader3d.bindData(this.shader3d.uniforms.get("time") as WebGL2RenderingContext, this.time, GLSLType.float)
            this.shader3d.bindData(this.shader3d.uniforms.get("drawComplete") as WebGL2RenderingContext, true, GLSLType.bool)
            this.plane.draw()

        }
    }

    bindUniforms(shader: Shader) {
        shader.bind()
        shader.bindData(shader.uniforms.get("maxValue") as WebGL2RenderingContext, this.functionLimit, GLSLType.float)
        shader.bindData(shader.uniforms.get("iResolution") as WebGL2RenderingContext, this.iResolution, GLSLType.vec2)
        shader.bindData(shader.uniforms.get("viewMatrix") as WebGL2RenderingContext, this.cameraTracker.viewMatrix, GLSLType.mat4)
        shader.bindData(shader.uniforms.get("projectionMatrix") as WebGL2RenderingContext, this.cameraTracker.projectionMatrix, GLSLType.mat4)
        shader.bindData(shader.uniforms.get("scale") as WebGL2RenderingContext, this.scale, GLSLType.float)
    }
}