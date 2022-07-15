import React, { useRef, useEffect, useState } from "react";
import "./canvas.css";

export default function Canvas({ handlerDraw,
  animate,
  width,
  height,
  handleMouseMove,
  handleMouseDown,
  handleTouchMove }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    if (animate) {
      const render = (t) => {
        handlerDraw(context, t);
        animationFrameId = window.requestAnimationFrame(render);
      };
      render(0);
    } else {
      window.cancelAnimationFrame(animationFrameId);
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
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
