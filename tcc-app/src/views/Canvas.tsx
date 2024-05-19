import {useEffect, useRef, useState} from "react";
import Engine from "../lib/Engine.ts";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engine = useRef<Engine>()
    const [limit, setLimit] = useState<number>(100)

    useEffect(() => {
        const r = engine.current = new Engine(canvasRef.current as HTMLCanvasElement) as Engine
        r.start()
        return () => r.stop()
    }, [])

    useEffect(() => {
        if(engine.current) {
            engine.current.renderer.functionLimit = limit/10
        }
    }, [limit]);

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <canvas width={1000} height={1000} style={{border: "#e0e0e0 1px solid"}} ref={canvasRef}/>
            <div style={{ width: "100%", display: "flex", gap: "8px"}}>
                {limit/10}
                <input type={"range"} max={100} min={-100} style={{ width: "100%"}} onChange={e => setLimit(parseFloat(e.currentTarget.value))}/>
            </div>
        </div>
    )
}