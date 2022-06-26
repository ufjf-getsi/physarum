import React, { useRef, useEffect } from "react";
import useCanvas from "./useCanvas";
import "./canvas.css";

export default function Canvas(props) {
  const {
    draw,
    width,
    height,
    handleMouseMove,
    handleMouseDown,
    handleTouchMove,
    ...rest
  } = props;
  const canvasRef = useCanvas(draw);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={(event) => handleMouseMove(event)}
      onMouseDown={() => handleMouseDown()}
      onTouchMove={(event) => handleTouchMove(event)}
    ></canvas>
  );
}
