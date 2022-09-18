import React, { useRef, useEffect } from "react";
import "./TelaAnimacao.css";

export default function TelaAnimacao({
  handleAnimationStep,
  handleDraw,
  animate,
  width,
  height,
  handleMouseMove,
  handleMouseDown,
  handleTouchMove,
  simulador,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    if (animate) {
      const render = (time) => {
        handleAnimationStep(context, time);
        animationFrameId = window.requestAnimationFrame(render);
      };
      animationFrameId = window.requestAnimationFrame(render);
    } else {
      handleDraw(context);
      window.cancelAnimationFrame(animationFrameId);
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [animate]);
  simulador.canvas = canvasRef.current;
  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={(event) => handleMouseMove(event)}
      onMouseDown={(event) => handleMouseDown(event)}
      onTouchMove={(event) => handleTouchMove(event)}
    ></canvas>
  );
}
