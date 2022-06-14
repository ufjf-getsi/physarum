import React from 'react';
import Canvas from './components/Canvas/Canvas';
import './App.css';

// Tamanho da matriz de plano
const LINHAS = 11;
const COLUNAS = 11;

export default function App() {

  let plano = [];
  let t0 = null; // Tempo inicial

  // Preenche o plano com valores aleatórios
  for (let l = 0; l < LINHAS; l++) {
    plano[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      plano[l][c] = Math.random() * 0; // Número aleatório entre 0 e 9.99...
    }
  }

  //Define um espaço no plano como valor máximo
  plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)] = 10;

  // Desenha na tela
  const draw = (ctx, t) => {
    if (t0 === null) { t0 = t; }
    const dt = (t - t0) / 1000; // Intervalo entre tempo atual e anterior

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Difusãpo da concetração
    difusao(plano, dt);

    // Decaimento de intensidade
    //decaimento(plano, dt);

    // Desenha na tela conforme os valores do plano
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        ctx.fillStyle = `hsl(${(10 - plano[l][c]) * 10}deg, 100%, 50%)`;
        ctx.fillRect(c * 10, l * 10, 10, 10);
        ctx.fillStyle = "black";
        //ctx.fillText(plano[l][c].toFixed(3), l * 10, c * 10 + 10);
      }
    }
    //ctx.fillText(dt * 1, 10, 10);

    // Define tempo inicial da próxima animação como o tempo atual
    t0 = t;
  };

  console.table(plano);

  return (
    <div className="app">
      <div className="app-container">
        <Canvas draw={draw} width={LINHAS * 10} height={COLUNAS * 10} />
      </div>
    </div>
  );
}

function difusao(plano, dt) {

  const fatorDifusao = 0.1;
  let qtdDifusoes = 0;

  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      const espaco = plano[l][c];

      if (l - 1 >= 0) { plano[l - 1][c] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l - 1][c] < 0) plano[l - 1][c] = 0; } // B
      if (c - 1 >= 0) { plano[l][c - 1] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l][c - 1] < 0) plano[l][c - 1] = 0; } // D
      if (c + 1 < COLUNAS) { plano[l][c + 1] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l][c + 1] < 0) plano[l][c + 1] = 0; } // F
      if (l + 1 < LINHAS) { plano[l + 1][c] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l + 1][c] < 0) plano[l + 1][c] = 0; } // H
      if (l - 1 >= 0 && c - 1 >= 0) { plano[l - 1][c - 1] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l - 1][c - 1] < 0) [l - 1][c - 1] = 0; } // A
      if (l - 1 >= 0 && c + 1 < COLUNAS) { plano[l - 1][c + 1] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l - 1][c + 1] < 0) plano[l - 1][c + 1] = 0; } // C
      if (l + 1 < LINHAS && c - 1 >= 0) { plano[l + 1][c - 1] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l + 1][c - 1] < 0) plano[l + 1][c - 1] = 0; } // G
      if (l + 1 < LINHAS && c + 1 < COLUNAS) { plano[l + 1][c + 1] += espaco * fatorDifusao * dt; qtdDifusoes++; if (plano[l + 1][c + 1] < 0) plano[l + 1][c + 1] = 0; } // I
      plano[l][c] -= qtdDifusoes * fatorDifusao * dt;
      if (plano[l][c] < 0) plano[l][c] = 0;
      qtdDifusoes = 0;
    }
  }

}

function decaimento(plano, dt) {
  const fatorDecaimento = 0.25;
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      if (plano[l][c] > 0) {
        plano[l][c] += (-1 * fatorDecaimento * dt); // Diminui em 1 de intensidade por segundo
        if (plano[l][c] < 0) {
          plano[l][c] = 0;
        }
      }
    }
  }
}
