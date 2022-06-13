import React from 'react';
import Canvas from './components/Canvas/Canvas';
import './App.css';

export default function App() {

  const draw = (ctx, frameCount) => {
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10, 10, 55, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
  };

  return (
    <div className="App">
      <Canvas draw={draw} />
    </div>
  );
}
