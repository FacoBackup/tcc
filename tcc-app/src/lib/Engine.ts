import Renderer from "./Renderer.ts";

export default class Engine {

    private readonly _gl: WebGL2RenderingContext
    private readonly _canvas: HTMLCanvasElement
    private _elapsed = 0;
    private previousCurrentTime = 0;
    private frame: number | null = null;
    private running = false;
    private readonly _renderer: Renderer;

    constructor(canvas: HTMLCanvasElement) {
        this._gl = canvas.getContext("webgl2", {
            antialias: false,
            premultipliedAlpha: false,
            powerPreference: "high-performance"
        }) as WebGL2RenderingContext
        this._canvas = canvas
        this.gl.getExtension("EXT_color_buffer_float")
        this.gl.getExtension("OES_texture_float")
        this.gl.getExtension("OES_texture_float_linear")
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.cullFace(this.gl.BACK)
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.depthFunc(this.gl.LESS)
        this.gl.frontFace(this.gl.CCW)
        this._renderer = new Renderer(this)
    }

    get gl(): WebGL2RenderingContext {
        return this._gl;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get renderer(): Renderer {
        return this._renderer;
    }

    get elapsed(): number {
        return this._elapsed;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.frame = requestAnimationFrame(c => this.loop(c))
        }
    }

    stop() {
        if (this.frame != null) {
            cancelAnimationFrame(this.frame)
            this.frame = null
        }
    }

    private loop(current: number) {
        try {
            this._elapsed = current - this.previousCurrentTime
            this.previousCurrentTime = current
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
            this.renderer.draw()
            this.frame = requestAnimationFrame(c => this.loop(c))
        } catch (err) {
            console.error(err)
        }
    }
}