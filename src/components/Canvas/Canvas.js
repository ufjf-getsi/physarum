import React, { useRef, useEffect } from "react";
import useCanvas from './useCanvas';

export default function Canvas(props) {

    const { draw, ...rest } = props;
    const canvasRef = useCanvas(draw);

    return (<canvas ref={canvasRef} {...rest}></canvas>);
}