import Engine from "./Engine.ts";
import Shader from "./Shader.ts";
// @ts-ignore
import fragment from "./shaders/fragment.frag?raw"
// @ts-ignore
import frag3d from "./shaders/frag3d.frag?raw"
// @ts-ignore
import vertex from "./shaders/vertex.vert?raw"
// @ts-ignore
import vertex3d from "./shaders/vertex3d.vert?raw"

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
    private readonly line: Mesh;
    private shader2d: Shader;
    private shader3d: Shader;
    show2d = false;

    constructor(engine: Engine) {
        this.engine = engine;
        this.shader2d = new Shader(this.engine.gl, vertex, fragment)
        this.shader3d = new Shader(this.engine.gl, vertex3d, frag3d)
        this.quad = new Mesh(this.engine.gl, QUAD)
        this.plane = generateSurface(this.engine.gl, 600, false)
        this.line = generateSurface(this.engine.gl, 600, true)
        this.cameraTracker = new CameraTracker(engine.canvas)
    }

    draw() {
        this.engine.gl.disable(this.engine.gl.CULL_FACE)
        if(this.show2d) {
            this.shader2d.bind()
            this.shader2d.bindData(this.shader2d.uniforms.get("time") as WebGL2RenderingContext, this.engine.elapsed / 500., GLSLType.float)
            this.shader2d.bindData(this.shader2d.uniforms.get("maxValue") as WebGL2RenderingContext, this.functionLimit, GLSLType.float)
            this.shader2d.bindData(this.shader2d.uniforms.get("iResolution") as WebGL2RenderingContext, this.iResolution, GLSLType.vec2)
            this.quad.draw()
        }else {
            this.shader3d.bind()
            this.shader3d.bindData(this.shader3d.uniforms.get("time") as WebGL2RenderingContext, this.engine.elapsed / 500., GLSLType.float)
            this.shader3d.bindData(this.shader3d.uniforms.get("maxValue") as WebGL2RenderingContext, this.functionLimit, GLSLType.float)
            this.shader3d.bindData(this.shader3d.uniforms.get("iResolution") as WebGL2RenderingContext, this.iResolution, GLSLType.vec2)
            this.shader3d.bindData(this.shader3d.uniforms.get("viewMatrix") as WebGL2RenderingContext, this.cameraTracker.viewMatrix, GLSLType.mat4)
            this.shader3d.bindData(this.shader3d.uniforms.get("projectionMatrix") as WebGL2RenderingContext, this.cameraTracker.projectionMatrix, GLSLType.mat4)
            this.plane.draw()
        }
    }
}