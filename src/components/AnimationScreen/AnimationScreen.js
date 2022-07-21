import React, { useRef, useEffect } from "react";
import "./AnimationScreen.css";

export default function AnimationScreen({
  handleAnimationStep,
  handleDraw,
  animate,
  width,
  height,
  handleMouseMove,
  handleMouseDown,
  handleTouchMove,
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
