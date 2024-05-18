import Engine from "./Engine.ts";
import Shader from "./Shader.ts";
// @ts-ignore
import fragment from "./shaders/fragment.frag?raw"
// @ts-ignore
import vertex from "./shaders/vertex.vert?raw"
import Mesh from "./Mesh.ts";
import {GLSLType, QUAD} from "../Models.ts";

export default class Renderer {
    private readonly engine: Engine;
    private readonly shader: Shader
    private readonly _quad: Mesh;

    constructor(engine: Engine) {
        this.engine = engine;
        this.shader = new Shader(this.engine.gl, vertex, fragment)
        this._quad = new Mesh(this.engine.gl, QUAD)
    }

    get quad(): Mesh {
        return this._quad;
    }

    draw() {
        const shader = this.shader
        const quad = this.quad
        shader.bind()
        shader.bindData(shader.uniforms.get("time") as WebGL2RenderingContext, this.engine.elapsed / 500., GLSLType.float)
        quad.draw()
    }
}