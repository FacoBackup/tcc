import GLSLTypes, {GLSLType} from "../Models.ts";
import extractUniforms from "./extract-uniforms.ts";

export default class Shader {
    private readonly gl: WebGL2RenderingContext;
    private readonly program: WebGLProgram;
    private readonly _uniforms: Map<string, WebGLUniformLocation>;

    constructor(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
        this.gl = gl
        this.program = gl.createProgram() as WebGLProgram

        vertex = "#version 300 es\n" + vertex
        fragment = "#version 300 es\n" + fragment

        const vertexShader = this.compileShader(vertex, gl.VERTEX_SHADER)
        const fragmentShader = this.compileShader(fragment, gl.FRAGMENT_SHADER)

        gl.attachShader(this.program, vertexShader)
        gl.attachShader(this.program, fragmentShader)
        gl.linkProgram(this.program)
        gl.flush()

        this._uniforms = new Map<string, WebGLUniformLocation>([...extractUniforms(gl, this.program, vertex), ...extractUniforms(gl, this.program, fragment)])
    }

    private compileShader(shaderCode: string, shaderType: number) {
        const gl = this.gl

        const shader = gl.createShader(shaderType) as WebGLShader
        gl.shaderSource(shader, shaderCode)
        gl.compileShader(shader)
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (!compiled) {
            const error = gl.getShaderInfoLog(shader)
            console.error({error, shaderCode})
        }
        return shader
    }

    get uniforms(): Map<string, WebGLUniformLocation> {
        return this._uniforms;
    }

    bind() {
        this.gl.useProgram(this.program)
    }

    bindData(uLocation: WebGLUniformLocation, data: any, type: GLSLType, currentSamplerIndex?: number, increaseIndex?: () => void) {
        const gl = this.gl
        switch (type) {
            case GLSLType.float:
            case GLSLType.int:
            case GLSLType.vec2:
            case GLSLType.vec3:
            case GLSLType.vec4:
            case GLSLType.ivec2:
            case GLSLType.ivec3:
            case GLSLType.bool:
                if (data == null)
                    return
                // @ts-ignore
                gl[GLSLTypes[type]](uLocation, data)
                break
            case GLSLType.mat3:
                if (data == null)
                    return
                gl.uniformMatrix3fv(uLocation, false, data)
                break
            case GLSLType.mat4:
                if (data == null)
                    return
                gl.uniformMatrix4fv(uLocation, false, data)
                break
            case GLSLType.samplerCube:
                if (currentSamplerIndex !== undefined && increaseIndex !== undefined) {
                    gl.activeTexture(gl.TEXTURE0 + currentSamplerIndex)
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, data)
                    gl.uniform1i(uLocation, currentSamplerIndex)
                    increaseIndex()
                }
                break
            case GLSLType.sampler2D:
                if (currentSamplerIndex !== undefined && increaseIndex !== undefined) {
                    gl.activeTexture(gl.TEXTURE0 + currentSamplerIndex)
                    gl.bindTexture(gl.TEXTURE_2D, data)
                    gl.uniform1i(uLocation, currentSamplerIndex)
                    increaseIndex()
                }
                break
            default:
                break
        }

    }


}