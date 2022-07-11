import React from "react";
import Canvas from "./components/Canvas/Canvas";
import "./App.css";
import Formulario from "./components/Formulario/Formulario";

import Simulador from "./Simulador";

const simulador = new Simulador(50, 50);

export default function App() {
  // Gerenciadores de eventos
  const handleMouseMove = (event) => {
    event.preventDefault();
    if (simulador.desenhoPermitido) simulador.depositaIntensidade(event);
  };
  const handleMouseDown = (event) => {
    event.preventDefault();
    simulador.desenhoPermitido = true;
  };
  window.addEventListener("mouseup", () => {
    simulador.desenhoPermitido = false;
  });
  const handleTouchMove = (event) => {
    const toques = event.changedTouches;
    for (const key in toques) {
      if (toques.hasOwnProperty(key)) {
        const toque = toques[key];
        simulador.depositaIntensidade(toque);
      }
    }
  };
  const handleClick = (event) => {
    const botaoId = event.target.id;
    switch (botaoId) {
      case "botaoPause":
        if (simulador.animacaoPermitida) {
          event.currentTarget.innerText = "Continuar";
        } else {
          event.currentTarget.innerText = "Pausar";
        }
        simulador.animacaoPermitida = !simulador.animacaoPermitida;
        break;

      case "botaoReiniciar":
        simulador.inicializarComValoresPadrao();
        break;

      default:
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formDados = new FormData(event.target);
    const formProps = Object.fromEntries(formDados);
    simulador.fatorAdicao = Number(formProps.fatorAdicao);
    simulador.fatorDecaimento = Number(formProps.fatorDecaimento);
    simulador.fatorDifusao.a = Number(formProps.fatorDifusaoA);
    simulador.fatorDifusao.b = Number(formProps.fatorDifusaoB);
    simulador.valoresPadrao.a = formProps.padraoA;
    simulador.valoresPadrao.b = formProps.padraoB;
    let linhasForm = parseInt(formProps.qtdLinhas);
    let colunasForm = parseInt(formProps.qtdColunas);
    let tamanhoForm = parseInt(formProps.tamanho);

    if (
      linhasForm !== simulador.LINHAS ||
      colunasForm !== simulador.COLUNAS ||
      tamanhoForm != simulador.TAMANHO
    ) {
      simulador.mudarTamanho(linhasForm, colunasForm, tamanhoForm);

      const canvas = document.querySelector("canvas");
      canvas.setAttribute("width", simulador.COLUNAS * simulador.TAMANHO);
      canvas.setAttribute("height", simulador.LINHAS * simulador.TAMANHO);
    }
  };

  //Testes
  // simulacao.plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)].a = 10;

  return (
    <div className="app">
      <div className="app-container">
        <div>
          <Canvas
            draw={simulador.draw.bind(simulador)}
            width={simulador.COLUNAS * simulador.TAMANHO}
            height={simulador.LINHAS * simulador.TAMANHO}
            handleMouseMove={handleMouseMove}
            handleMouseDown={handleMouseDown}
            handleTouchMove={handleTouchMove}
            animacaoPermitida={simulador.animacaoPermitida}
          />
        </div>
        <div className="linha">
          <div className="grupo-info">
            <label htmlFor="ferA">A:</label>
            <p id="infoFerA">0</p>
          </div>
          <div className="grupo-info">
            <label htmlFor="ferB">B:</label>
            <p id="infoFerB">0</p>
          </div>
        </div>
        <Formulario handleClick={handleClick} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
