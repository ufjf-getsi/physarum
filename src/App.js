import React from "react";
import Canvas from "./components/Canvas/Canvas";
import "./App.css";

// Dimensões do plano
const LINHAS = 20;
const COLUNAS = 50;
const TAMANHO = 10;

// Controle de animação
let animacaoPermitida = true;

export default function App() {
  let plano = [];
  let planoFuturo = [];
  let t0 = null; // Tempo inicial
  let desenhoPermitido = false;

  // Gerenciadores de eventos
  const handleMouseMove = (event) => {
    if (desenhoPermitido) depositaIntensidade(event);
  };
  const handleMouseDown = () => {
    desenhoPermitido = true;
  };
  window.addEventListener("mouseup", () => {
    desenhoPermitido = false;
  });
  const handleTouchMove = (event) => {
    const toques = event.changedTouches;
    for (const key in toques) {
      if (toques.hasOwnProperty(key)) {
        const toque = toques[key];
        depositaIntensidade(toque);
      }
    }
  };

  function depositaIntensidade(e) {
    const canvas = e.target;
    const caixa = canvas.getBoundingClientRect();
    const escalaX = canvas.width / caixa.width;
    const escalaY = canvas.height / caixa.height;
    const x = (e.clientX - caixa.x) * escalaX;
    const y = (e.clientY - caixa.top) * escalaY;
    const l = Math.floor(y / TAMANHO);
    const c = Math.floor(x / TAMANHO);
    if (l >= 0 && l < LINHAS && c >= 0 && c < COLUNAS) plano[l][c] = 1;
  }

  // Preenche o plano com valores aleatórios
  for (let l = 0; l < LINHAS; l++) {
    plano[l] = [];
    planoFuturo[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      plano[l][c] = Math.random(); // Número aleatório entre 0 e 0.999...
      planoFuturo[l][c] = plano[l][c];
    }
  }

  //Testes
  plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)] = 10;
  //plano[0][0] = 1;
  //plano[7][3] = 0;

  // Desenha na tela
  const draw = (ctx, t) => {
    if (t0 === null) {
      t0 = t;
    }
    let dt = (t - t0) / 1000; // Intervalo entre tempo atual e anterior
    if (!animacaoPermitida) dt = 0;

    // Limpa desenho anterior
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let somaIntensidade = 0;
    // Desenha na tela conforme os valores do plano
    for (let l = 0; l < LINHAS; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        ctx.fillStyle = `hsl(${(1 - plano[l][c]) * 100}deg, 100%, 50%)`;
        somaIntensidade += plano[l][c];
        ctx.fillRect(c * TAMANHO, l * TAMANHO, TAMANHO, TAMANHO);
      }
    }

    // Exibe concentração total
    ctx.fillStyle = "black";
    ctx.fillText(somaIntensidade, 3 * 10, 3 * 10 + 10);

    // Difusão da concentração
    difusao(plano, planoFuturo, dt);
    atualizaPlano(plano, planoFuturo);

    // Define tempo inicial da próxima animação como o tempo atual
    t0 = t;
  };

  return (
    <div className="app">
      <div className="app-container">
        <div>
          <Canvas
            draw={draw}
            width={COLUNAS * TAMANHO}
            height={LINHAS * TAMANHO}
            handleMouseMove={handleMouseMove}
            handleMouseDown={handleMouseDown}
            handleTouchMove={handleTouchMove}
            animacaoPermitida={animacaoPermitida}
          />
        </div>
        <div>
          <button
            onClick={function (e) {
              if (animacaoPermitida) e.currentTarget.innerText = "Continuar";
              else e.currentTarget.innerText = "Pausar";
              animacaoPermitida = !animacaoPermitida;
            }}
          >
            Pausar
          </button>
        </div>
      </div>
    </div>
  );
}

function calculaAcrescimoIntensidade(plano, l, c) {
  let pesoOrtog = 0.2;
  let pesoDiag = 0.05;
  let remocao = 0;

  let intensidadeRedor = 0;
  if (l - 1 >= 0) {
    intensidadeRedor += plano[l - 1][c] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (l + 1 < LINHAS) {
    intensidadeRedor += plano[l + 1][c] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (c - 1 >= 0) {
    intensidadeRedor += plano[l][c - 1] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (c + 1 < COLUNAS) {
    intensidadeRedor += plano[l][c + 1] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (l - 1 >= 0 && c - 1 >= 0) {
    intensidadeRedor += plano[l - 1][c - 1] * pesoDiag;
    remocao += pesoDiag;
  }
  if (l - 1 >= 0 && c + 1 < COLUNAS) {
    intensidadeRedor += plano[l - 1][c + 1] * pesoDiag;
    remocao += pesoDiag;
  }
  if (l + 1 < LINHAS && c - 1 >= 0) {
    intensidadeRedor += plano[l + 1][c - 1] * pesoDiag;
    remocao += pesoDiag;
  }
  if (l + 1 < LINHAS && c + 1 < COLUNAS) {
    intensidadeRedor += plano[l + 1][c + 1] * pesoDiag;
    remocao += pesoDiag;
  }
  intensidadeRedor += plano[l][c] * -1 * remocao;

  return intensidadeRedor;
}

function difusao(plano, planoFuturo, dt) {
  const fatorDecaimento = 0.06;
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
