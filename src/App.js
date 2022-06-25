import React from "react";
import Canvas from "./components/Canvas/Canvas";
import "./App.css";

// Tamanho da matriz de plano
const LINHAS = 200;
const COLUNAS = 200;

export default function App() {
  let plano = [];
  let planoFuturo = [];
  let t0 = null; // Tempo inicial

  // Preenche o plano com valores aleatórios
  for (let l = 0; l < LINHAS; l++) {
    plano[l] = [];
    planoFuturo[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      plano[l][c] = Math.random(); // Número aleatório entre 0 e 0.999...
      planoFuturo[l][c] = plano[l][c];
    }
  }

  //Define um espaço no plano como valor máximo
  //plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)] = 1;
  //plano[0][0] = 100;
  //plano[7][3] = 0;

  // Desenha na tela
  const draw = (ctx, t) => {
    if (t0 === null) {
      t0 = t;
    }
    const dt = (t - t0) / 1000; // Intervalo entre tempo atual e anterior

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenha na tela conforme os valores do plano
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        ctx.fillStyle = `hsl(${(1 - plano[l][c]) * 100}deg, 100%, 50%)`;
        ctx.fillRect(c * 10, l * 10, 10, 10);
      }
    }
    /*
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        ctx.fillStyle = "black";
        ctx.fillText((plano[l][c] * 10).toFixed(0), c * 10, l * 10 + 10);
      }
    }*/
    //ctx.fillText(dt * 1, 10, 10);

    // Difusão da concetração
    difusao(plano, planoFuturo, dt);
    atualizaPlano(plano, planoFuturo);

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

function calculaAcrescimoIntensidade(plano, l, c) {
  let celulasADispersar = 8;
  if (l === 0 || l === LINHAS - 1) {
    celulasADispersar = celulasADispersar - 3;
  }
  if (c === 0 || c === COLUNAS - 1) {
    celulasADispersar = celulasADispersar - 3;
  }
  if (
    (l === 0 && c === 0) ||
    (l === 0 && c === COLUNAS - 1) ||
    (l === LINHAS - 1 && c === 0) ||
    (l === LINHAS - 1 && c === COLUNAS - 1)
  ) {
    celulasADispersar = celulasADispersar + 1;
  }

  const pesoOrtog = 1 / celulasADispersar;
  const pesoDiag = 1 / celulasADispersar;
  let intensidadeRedor = 0;

  if (l - 1 >= 0) intensidadeRedor += plano[l - 1][c] * pesoOrtog;
  if (l + 1 < LINHAS) intensidadeRedor += plano[l + 1][c] * pesoOrtog;
  if (c - 1 >= 0) intensidadeRedor += plano[l][c - 1] * pesoOrtog;
  if (c + 1 < COLUNAS) intensidadeRedor += plano[l][c + 1] * pesoOrtog;

  if (l - 1 >= 0 && c - 1 >= 0)
    intensidadeRedor += plano[l - 1][c - 1] * pesoDiag;
  if (l - 1 >= 0 && c + 1 < COLUNAS)
    intensidadeRedor += plano[l - 1][c + 1] * pesoDiag;
  if (l + 1 < LINHAS && c - 1 >= 0)
    intensidadeRedor += plano[l + 1][c - 1] * pesoDiag;
  if (l + 1 < LINHAS && c + 1 < COLUNAS)
    intensidadeRedor += plano[l + 1][c + 1] * pesoDiag;

  intensidadeRedor += plano[l][c] * -1;

  return intensidadeRedor;
}

function difusao(plano, planoFuturo, dt) {
  const fatorDecaimento = 0.006;
  const fatorDifusao = 1.05;

  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      const elemento = plano[l][c];
      planoFuturo[l][c] =
        elemento +
        (fatorDifusao * calculaAcrescimoIntensidade(plano, l, c) -
          fatorDecaimento * elemento) *
          dt;
      if (planoFuturo[l][c] < 0) {
        planoFuturo[l][c] = 0;
      }
    }
  }
}

function atualizaPlano(plano, planoFuturo) {
  const aux = [];
  for (let l = 0; l < LINHAS; l++) {
    aux[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      aux[l][c] = plano[l][c];
      plano[l][c] = planoFuturo[l][c];
      planoFuturo[l][c] = aux[l][c];
    }
  }
}
