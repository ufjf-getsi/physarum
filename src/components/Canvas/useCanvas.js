import React, { useRef, useEffect } from "react";

const useCanvas = draw => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas.getContext) {
            const context = canvas.getContext("2d");

            let animationFrameId;

            const render = (t) => {
                draw(context, t);
                animationFrameId = window.requestAnimationFrame(render);
            };
            render(0);

            return () => {
                window.cancelAnimationFrame(animationFrameId);
            }
        }
    }, [draw]);

    return canvasRef;
};

export default useCanvas;