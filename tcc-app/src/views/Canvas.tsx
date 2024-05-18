import {useEffect, useRef} from "react";
import Engine from "../lib/Engine.ts";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engine = useRef<Engine>()

    useEffect(() => {
        const r = engine.current = new Engine(canvasRef.current as HTMLCanvasElement) as Engine
        r.start()
        return () => r.stop()
    }, [])

    return (
        <div>
            <canvas width={1000} height={1000} style={{border: "#e0e0e0 1px solid"}} ref={canvasRef}/>
        </div>
    )
}