import {useEffect, useRef, useState} from "react";
import Engine from "./lib/Engine.ts";

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engine = useRef<Engine>()
    const [limit, setLimit] = useState<number>(100)

    useEffect(() => {
        const r = engine.current = new Engine(canvasRef.current as HTMLCanvasElement) as Engine
        r.start()
        return () => r.stop()
    }, [])

    useEffect(() => {
        if (engine.current) {
            engine.current.renderer.time = limit / 10
        }
    }, [limit]);

    return (
        <div style={{display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden"}}>
            <canvas width={100} height={100} style={{width: "100%", height: "calc(100% - 32px)"}} ref={canvasRef}/>
            <div style={{width: "100%", display: "flex", gap: "8px", height: "32px"}}>
                {limit / 10}
                <input type={"range"} max={100} min={-100} style={{width: "100%"}}
                       onChange={e => setLimit(parseFloat(e.currentTarget.value))}/>
            </div>
        </div>
    )
}


