import {mat4, vec3} from "gl-matrix";

const BUTTON_MIDDLE = 1

export default class CameraTracker {
    isFocused = false
    rotatingCamera = false
    movementSpeed = 0.01
    scrollSpeed = .01
    turnSpeed = .01
    yaw = Math.PI / 2
    pitch = -Math.PI / 2
    centerOn = vec3.create()
    position = vec3.create()
    viewMatrix = mat4.create()
    projectionMatrix = mat4.create()
    invViewMatrix = mat4.create()
    invProjectionMatrix = mat4.create()
    radius = 1
    zNear = .1
    zFar = 100
    fov = Math.PI / 2
    aspectRatio = 1
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousemove", ev => this.#handleInput(ev))
        canvas.addEventListener("mousedown", ev => this.#handleInput(ev))
        canvas.addEventListener("wheel", ev => this.#handleInput(ev))
        this.canvas = canvas
        this.updateProjectionValues();
        const OBS = new ResizeObserver(() => {
            this.updateProjectionValues();
        })
        OBS.observe(canvas)
        this.updateViewMatrix()
    }

    private updateProjectionValues() {
        const bBox = this.canvas.getBoundingClientRect()
        this.aspectRatio = bBox.width / bBox.height
        this.updateProjectionMatrix()
    }

    #incrementCameraPlacement(ctrlKey: boolean, increment: number) {
        if (ctrlKey) {
            const cosPitch = Math.cos(this.pitch)
            const position = vec3.create()
            position[0] = increment * cosPitch * Math.cos(this.yaw)
            position[1] = increment * Math.sin(this.pitch)
            position[2] = increment * cosPitch * Math.sin(this.yaw)

            vec3.add(this.centerOn, this.centerOn, position)
            this.updateViewMatrix()
        } else {
            this.radius += increment
            this.updateViewMatrix()
        }
    }

    rotateY(angle: number, vec: vec3) {
        const matrix = new Array(4)
        for (let i = 0; i < 4; i++) {
            matrix[i] = new Array(4).fill(0)
        }
        matrix[0][0] = Math.cos(angle)
        matrix[0][2] = Math.sin(angle)
        matrix[2][0] = -Math.sin(angle)
        matrix[1][1] = 1
        matrix[2][2] = Math.cos(angle)
        matrix[3][3] = 1
        return [
            vec[0] * matrix[0][0] + vec[1] * matrix[1][0] + vec[2] * matrix[2][0],
            vec[0] * matrix[0][1] + vec[1] * matrix[1][1] + vec[2] * matrix[2][1],
            vec[0] * matrix[0][2] + vec[1] * matrix[1][2] + vec[2] * matrix[2][2]
        ]
    }

    #handleInput(event: MouseEvent) {
        switch (event.type) {
            case "wheel": {
                const ev = event as WheelEvent
                const forward = ev.deltaY < 0
                const distance = (forward ? 1 : -1) * this.scrollSpeed

                this.#incrementCameraPlacement(event.ctrlKey, -distance)
                break
            }
            case "mousemove": {
                if (this.isFocused || this.rotatingCamera) {
                    if (!this.rotatingCamera) {
                        if (event.movementY < 0) {
                            this.pitch += this.turnSpeed * Math.abs(event.movementY)
                        } else if (event.movementY >= 0) {
                            this.pitch -= this.turnSpeed * Math.abs(event.movementY)
                        }

                        if (event.movementX >= 0) {
                            this.yaw += this.turnSpeed * Math.abs(event.movementX)
                        } else if (event.movementX < 0) {
                            this.yaw -= this.turnSpeed * Math.abs(event.movementX)
                        }
                    } else {
                        const newPosition = this.rotateY(this.yaw, [event.ctrlKey ? 0 : this.movementSpeed * event.movementY, 0, -this.movementSpeed * event.movementX])
                        this.centerOn[0] += newPosition[0]
                        this.centerOn[1] -= event.ctrlKey ? this.movementSpeed * event.movementY : newPosition[1]
                        this.centerOn[2] += newPosition[2]
                    }
                    this.updateViewMatrix()
                }
                break
            }
            case "mousedown":
                document.body.addEventListener("mouseup", ev => this.#handleInput(ev), {once: true})
                if (event.button === BUTTON_MIDDLE) {
                    this.isFocused = true
                } else {
                    this.rotatingCamera = true
                    this.canvas.requestPointerLock()
                }
                break
            case "mouseup":
                this.isFocused = false
                this.rotatingCamera = false
                document.exitPointerLock()
                break
        }
    }

    updateViewMatrix() {
        const cosPitch = Math.cos(this.pitch)
        const position = vec3.create()
        position[0] = this.radius * cosPitch * Math.cos(this.yaw) + this.centerOn[0]
        position[1] = this.radius * Math.sin(this.pitch) + this.centerOn[1]
        position[2] = this.radius * cosPitch * Math.sin(this.yaw) + this.centerOn[2]


        mat4.lookAt(this.viewMatrix, position, this.centerOn, [0, 1, 0])
        mat4.invert(this.invViewMatrix, this.viewMatrix)

        const m = this.invViewMatrix
        this.position = [m[12], m[13], m[14]]
        console.log({
            yaw: this.yaw,
            pitch: this.pitch,
            radius: this.radius,
            centerOnX: this.centerOn[0],
            centerOnY: this.centerOn[1],
            centerOnZ: this.centerOn[2],
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.position[2]
        })
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspectRatio, this.zNear, this.zFar)
        mat4.invert(this.invProjectionMatrix, this.projectionMatrix)
    }
}