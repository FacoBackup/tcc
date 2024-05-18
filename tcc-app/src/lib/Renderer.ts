import Engine from "./Engine.ts";
import Shader from "./Shader.ts";
import fragment from "./shaders/fragment.frag?raw"
import vertex from "./shaders/vertex.vert?raw"
import Mesh from "./Mesh.ts";
import {QUAD} from "../Models.ts";

export default class Renderer {
    private readonly engine: Engine;
    private readonly shader: Shader
    private readonly _quad: Mesh;

    constructor(engine: Engine) {
        this.engine = engine;
        this.shader = new Shader(this.engine.gl, vertex, fragment)
        this._quad = new Mesh(this.engine.gl, QUAD)
        console.log(this.quad)
    }

    get quad(): Mesh {
        return this._quad;
    }

    draw() {
        const shader = this.shader
        const quad = this.quad
        shader.bind()
        quad.draw()
    }
}