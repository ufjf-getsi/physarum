import React from 'react';
import Canvas from './components/Canvas/Canvas';
import './App.css';

const LINHAS = 10;
const COLUNAS = 15;

export default function App() {

  const matriz = [];
  let t0 = null;

  for (let l = 0; l < LINHAS; l++) {
    matriz[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      matriz[l][c] = Math.random() * 0;
    }
  }

  matriz[5][2] = 10;

  const draw = (ctx, t) => {
    if (t0 === null) { t0 = t; }
    const dt = (t - t0) / 1000;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        if (matriz[l][c] > 0) {
          matriz[l][c] += (-1 * dt);
        }
        else {
          matriz[l][c] = 0;
        }
      }
    }

    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        ctx.fillStyle = `hsl(${(10 - matriz[l][c]) * 10}deg, 100%, 50%)`;
        ctx.fillRect(c * 10, l * 10, 10, 10);
      }
    }

    ctx.fillStyle = "black";
    ctx.fillText(matriz[5][2], 50, 50);
    ctx.fillText(dt * 1, 50, 60);

    t0 = t;
  };

  return (
    <div className="App">
      <Canvas draw={draw} />
    </div>
  );
}
