import React, { useState } from "react";
import "./App.css";
import InfoDisplay from "./components/InfoDisplay/InfoDisplay";
import AnimationScreen from "./components/AnimationScreen/AnimationScreen";
import Painel from "./components/Painel/Painel";

import Simulador from "./Simulador";

const simulador = new Simulador(50, 50);
simulador.simulacaoPermitida = false;

export default function App() {
  const [animate, setAnimate] = useState(false);
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
        setAnimate(simulador.animacaoPermitida);
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
  const handleChange = (event) => {
    simulador.camadaExibida = event.target.value;
  };

  //Testes
  // simulacao.plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)].a = 10;

  return (
    <div className="app">
      <div className="app-container">
        <div>
          <AnimationScreen
            animate={animate}
            width={simulador.COLUNAS * simulador.TAMANHO}
            height={simulador.LINHAS * simulador.TAMANHO}
            handlerDraw={simulador.draw.bind(simulador)}
            handleMouseMove={handleMouseMove}
            handleMouseDown={handleMouseDown}
            handleTouchMove={handleTouchMove}
          />
        </div>
        <InfoDisplay />
        <Painel
          handleClick={handleClick}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}
