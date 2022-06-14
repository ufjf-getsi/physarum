import React from 'react';
import Canvas from './components/Canvas/Canvas';
import './App.css';

// Tamanho da matriz de plano
const LINHAS = 100;
const COLUNAS = 100;

export default function App() {

  const plano = [];
  let t0 = null; // Tempo inicial

  // Preenche o plano com valores aleatórios
  for (let l = 0; l < LINHAS; l++) {
    plano[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      plano[l][c] = Math.random() * 10; // Número aleatório entre 0 e 9.99...
    }
  }

  //Define um espaço no plano como valor máximo
  plano[LINHAS / 2][COLUNAS / 2] = 10;

  // Desenha na tela
  const draw = (ctx, t) => {
    if (t0 === null) { t0 = t; }
    const dt = (t - t0) / 1000; // Intervalo entre tempo atual e anterior

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Definição de valores no plano
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        // Decaimento de intensidade
        if (plano[l][c] > 0) {
          plano[l][c] += (-1 * dt); // Diminui em 1 de intensidade por segundo
          if (plano[l][c] < 0) {
            plano[l][c] = 0;
          }
        }
      }
    }

    // Desenha na tela conforme os valores do plano
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        ctx.fillStyle = `hsl(${(10 - plano[l][c]) * 10}deg, 100%, 50%)`;
        ctx.fillRect(c * 10, l * 10, 10, 10);
        //ctx.fillStyle = "black";
        //ctx.fillText(plano[l][c].toFixed(0), l * 10, c * 10 + 10);
      }
    }
    //ctx.fillText(dt * 1, 10, 10);

    // Define tempo inicial da próxima animação como o tempo atual
    t0 = t;
  };

  return (
    <div className="app">
      <div className="app-container">
        <Canvas draw={draw} width={LINHAS * 10} height={COLUNAS * 10} />
      </div>
    </div>
  );
}
