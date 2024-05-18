import GLSLTypes from "../Models.ts";

const regex = /uniform(\s+)(highp|mediump|lowp)?(\s*)((\w|_)+)((\s|\w|_)*);/gm
const structRegex = (type: string) => {
    return new RegExp(`(struct\\s+${type}\\s*\\s*{.+?(?<=}))`, "gs")
}
const defineRegex = (global: boolean) => {
    return new RegExp("#define(\\s+)((\\w|_)+)(\\s+)(.+)", global ? "gmi" : "mi")
}
const regexMatch = /uniform(\s+)(highp|mediump|lowp)?(\s*)((\w|_)+)((\s|\w|_)*);$/m
const regexArray = (global: boolean) => {
    return new RegExp("uniform(\\s+)(highp|mediump|lowp)?(\\s*)((\\w|_)+)((\\s|\\w|_)*)\\[(\\w+)\\](\\s*);$", global ? "gm" : "m")
}

export default function extractUniforms(gl: WebGL2RenderingContext, program: WebGLProgram, code: string) {
    const uniformMap: Map<string, WebGLUniformLocation> = new Map();
    const uniforms = code.match(regex)
    if (uniforms == null) {
        return uniformMap;
    }
    uniforms.forEach(u => {
        const match = u.match(regexMatch)
        if (match === null)
            return []
        const type = match[4]
        const name: string = match[6].replace(" ", "").trim()

        if (Object.hasOwn(GLSLTypes, type)) {
            const location = gl.getUniformLocation(program, name)
            if (location != null) {
                uniformMap.set(name, location)
            }
            return
        }

        let struct = code.match(structRegex(type))
        const reg = /^(\s*)(\w+)(\s*)((\w|_)+)/m
        if (struct === null)
            return []
        const partial: string[] = struct[0].split("\n").filter(e => Object.keys(GLSLTypes).some(v => e.includes(v)))
        partial.forEach(s => {
            const current = s.match(reg)
            if (current) {
                const location = gl.getUniformLocation(program, name + "." + current[4])
                if (location != null) {
                    uniformMap.set(name, location)
                }
            }
        })

    })
    const arrayUniforms = code.match(regexArray(true))
    const definitions = code.match(defineRegex(true))
    if (arrayUniforms == null || definitions == null) {
        return uniformMap;
    }
    arrayUniforms.forEach(u => {
        const match = u.match(regexArray(false))

        if (!match)
            return
        const type = match[4]
        const name = match[6].replace(" ", "")
        const define = definitions.find(d => d.includes(match[8]))?.match(defineRegex(false))

        if (!define) return;
        const arraySize = parseInt(define[5])
        if (Object.hasOwn(GLSLTypes, type)) {
            uniformMap.set(name, (new Array(arraySize).fill(null)).map((_, i) => gl.getUniformLocation(program, name + `[${i}]`)))
            return
        }
        let struct = code.match(structRegex(type))
        const reg = /^(\s*)(\w+)(\s*)((\w|_)+)/m
        if (!struct) {
            return;
        }
        const partial = struct[0].split("\n").filter(e => Object.keys(GLSLTypes).some(v => e.includes(v)))
        for (const s of partial) {
            const current: string[] | null = s.match(reg)
            if (current == null) {
                continue;
            }
            uniformMap.set(name, (new Array(arraySize).fill(null)).map((_, i) => gl.getUniformLocation(program, name + `[${i}]` + "." + current[4])))
        }
    })
    return uniformMap
}