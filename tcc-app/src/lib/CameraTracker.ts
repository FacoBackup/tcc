import {mat4, vec3} from "gl-matrix";

const BUTTON_MIDDLE = 1

export default class CameraTracker {
    isFocused = false
    rotatingCamera = false
    scrollSpeed = .5
    turnSpeed = .01
    yaw = Math.PI / 2
    pitch = .5
    position = vec3.create()
    viewMatrix = mat4.create()
    projectionMatrix = mat4.create()
    invViewMatrix = mat4.create()
    invProjectionMatrix = mat4.create()
    radius =7
    zNear = .1
    zFar = 1000
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
        this.canvas.width = bBox.width
        this.canvas.height = bBox.height
        this.updateProjectionMatrix()
    }

    #incrementCameraPlacement(increment: number) {
        this.radius += increment
        this.updateViewMatrix()
    }

    #handleInput(event: MouseEvent) {
        switch (event.type) {
            case "wheel": {
                const ev = event as WheelEvent
                const forward = ev.deltaY < 0
                const distance = (forward ? 1 : -1) * this.scrollSpeed

                this.#incrementCameraPlacement(-distance)
                break
            }
            case "mousemove": {
                if (this.isFocused || this.rotatingCamera) {
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
        position[0] = this.radius * cosPitch * Math.cos(this.yaw);
        position[1] = this.radius * Math.sin(this.pitch);
        position[2] = this.radius * cosPitch * Math.sin(this.yaw);

        mat4.lookAt(this.viewMatrix, position, [0, 0, 0], [0, 1, 0])
        mat4.invert(this.invViewMatrix, this.viewMatrix)

        const m = this.invViewMatrix
        this.position = [m[12], m[13], m[14]]
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspectRatio, this.zNear, this.zFar)
        mat4.invert(this.invProjectionMatrix, this.projectionMatrix)
    }
}