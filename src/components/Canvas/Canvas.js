import React, { useRef, useEffect } from "react";
import useCanvas from "./useCanvas";
import "./canvas.css";

export default function Canvas({ draw,
  width,
  height,
  handleMouseMove,
  handleMouseDown,
  handleTouchMove }) {
  const canvasRef = useCanvas(draw);

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
