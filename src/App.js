import React from "react";
import Canvas from "./components/Canvas/Canvas";
import "./App.css";
import Formulario from "./components/Formulario/Formulario";

// Dimensões do plano
const LINHAS = 50;
const COLUNAS = 50;
const TAMANHO = 10;
const simulacao = { plano: [], planoFuturo: [] };

// Controle de animação
let animacaoPermitida = true;

// Controle do modelo
let fatorDecaimento = 0.062;
const fatorAlimentacao = 0.055;
let fatorDifusao = { a: 1, b: 0.5 };

export default function App() {
  let t0 = null; // Tempo inicial
  let desenhoPermitido = false;

  // Gerenciadores de eventos
  const handleMouseMove = (event) => {
    event.preventDefault();
    if (desenhoPermitido) depositaIntensidade(event);
  };
  const handleMouseDown = (event) => {
    event.preventDefault();
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
  const handleClick = (event) => {
    if (animacaoPermitida) event.currentTarget.innerText = "Continuar";
    else event.currentTarget.innerText = "Pausar";
    animacaoPermitida = !animacaoPermitida;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formConfigGroups = event.target.firstElementChild.children;
    const inputValues = Array.from(
      formConfigGroups,
      (x) => x.lastElementChild.value
    );
    fatorDecaimento = inputValues[0];
    fatorDifusao.a = inputValues[1];
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
    if (l >= 0 && l < LINHAS && c >= 0 && c < COLUNAS)
      simulacao.plano[l][c].a = 1;
  }

  // Preenche o plano com valores aleatórios
  for (let l = 0; l < LINHAS; l++) {
    simulacao.plano[l] = [];
    simulacao.planoFuturo[l] = [];
    for (let c = 0; c < COLUNAS; c++) {
      const celulaPlano = { a: 0, b: 1 };
      const celulaPlanoFuturo = { a: 0, b: 0 };
      simulacao.plano[l][c] = celulaPlano; // Número aleatório entre 0 e 0.999...
      simulacao.planoFuturo[l][c] = celulaPlanoFuturo;
    }
  }

  //Testes
  // simulacao.plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)].a = 10;

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
        let intensidadeA = simulacao.plano[l][c].a;
        let intensidadeB = simulacao.plano[l][c].b;
        ctx.fillStyle = `hsl(${(1 - intensidadeA) * 100}deg, 100%, ${
          intensidadeB * 100
        }%)`;
        somaIntensidade += intensidadeB;
        ctx.fillRect(c * TAMANHO, l * TAMANHO, TAMANHO, TAMANHO);
      }
    }
    // Exibe concentração total
    ctx.fillStyle = "black";
    ctx.fillText(somaIntensidade, 3 * 10, 3 * 10 + 10);

    // Difusão da concentração
    difusao(simulacao.plano, simulacao.planoFuturo, dt);

    // Troca de estado
    const aux = simulacao.plano;
    simulacao.plano = simulacao.planoFuturo;
    simulacao.planoFuturo = aux;

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
        <Formulario handleClick={handleClick} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function calculaAcrescimoIntensidade(plano, l, c, feromonio) {
  let pesoOrtog = 0.2;
  let pesoDiag = 0.05;
  let remocao = 0;

  let intensidadeRedor = 0;
  if (l - 1 >= 0) {
    intensidadeRedor += plano[l - 1][c][feromonio] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (l + 1 < LINHAS) {
    intensidadeRedor += plano[l + 1][c][feromonio] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (c - 1 >= 0) {
    intensidadeRedor += plano[l][c - 1][feromonio] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (c + 1 < COLUNAS) {
    intensidadeRedor += plano[l][c + 1][feromonio] * pesoOrtog;
    remocao += pesoOrtog;
  }
  if (l - 1 >= 0 && c - 1 >= 0) {
    intensidadeRedor += plano[l - 1][c - 1][feromonio] * pesoDiag;
    remocao += pesoDiag;
  }
  if (l - 1 >= 0 && c + 1 < COLUNAS) {
    intensidadeRedor += plano[l - 1][c + 1][feromonio] * pesoDiag;
    remocao += pesoDiag;
  }
  if (l + 1 < LINHAS && c - 1 >= 0) {
    intensidadeRedor += plano[l + 1][c - 1][feromonio] * pesoDiag;
    remocao += pesoDiag;
  }
  if (l + 1 < LINHAS && c + 1 < COLUNAS) {
    intensidadeRedor += plano[l + 1][c + 1][feromonio] * pesoDiag;
    remocao += pesoDiag;
  }
  intensidadeRedor += plano[l][c][feromonio] * -1 * remocao;

  return intensidadeRedor;
}

function difusao(plano, planoFuturo, dt) {
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      const intensidadeA = plano[l][c].a;
      const intensidadeB = plano[l][c].b;
      const intensidadeAFutura =
        intensidadeA +
        (fatorDifusao["a"] * calculaAcrescimoIntensidade(plano, l, c, "a") -
          intensidadeA * intensidadeB * intensidadeB +
          fatorAlimentacao * (1 - intensidadeA)) *
          dt;
      const intensidadeBFutura =
        intensidadeB +
        (fatorDifusao["b"] * calculaAcrescimoIntensidade(plano, l, c, "b") +
          intensidadeA * intensidadeB * intensidadeB -
          (fatorDecaimento + fatorAlimentacao) * intensidadeB) *
          dt;
      // console.log(intensidadeBFutura);
      if (intensidadeAFutura > 0) planoFuturo[l][c].a = intensidadeAFutura;
      else planoFuturo[l][c].a = 0;
      if (intensidadeBFutura > 0) planoFuturo[l][c].b = intensidadeBFutura;
      else planoFuturo[l][c].b = 0;
    }
  }
}
