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
  const [camadaExibida, setCamadaExibida] = useState("a");
  const [valoresLinhasConfigCamada, setValoresLinhasConfigCamada] = useState({
    a: { fatorDifusaoA: 1, fatorAdicao: 0.055, padraoA: "A" },
    b: { fatorDifusaoB: 0.5, fatorDecaimento: 0.062, padraoB: "A" },
  });

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
  const handleClickPlayPause = (event) => {
    setAnimate(!animate);
  };

  const handleClickReset = (event) => {
    simulador.inicializarComValoresPadrao();
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formDados = new FormData(event.target);
    const formProps = Object.fromEntries(formDados);
    switch (camadaExibida) {
      case "a":
        const fatorAdicao = Number(formProps.fatorAdicao);
        simulador.fatorAdicao = fatorAdicao;
        const fatorDifusaoA = Number(formProps.fatorDifusaoA);
        simulador.fatorDifusao.a = fatorDifusaoA;
        const valoresPadraoA = formProps.padraoA;
        simulador.valoresPadrao.a = valoresPadraoA;
        setValoresLinhasConfigCamada((prevState) => ({
          a: {
            fatorDifusaoA: fatorDifusaoA,
            fatorAdicao: fatorAdicao,
            padraoA: valoresPadraoA,
          },
          b: {
            ...prevState.b,
          },
        }));
        break;
      case "b":
        const fatorDecaimento = Number(formProps.fatorDecaimento);
        simulador.fatorDecaimento = fatorDecaimento;
        const fatorDifusaoB = Number(formProps.fatorDifusaoB);
        simulador.fatorDifusao.b = fatorDifusaoB;
        const valoresPadraoB = formProps.padraoB;
        simulador.valoresPadrao.b = valoresPadraoB;
        setValoresLinhasConfigCamada((prevState) => ({
          a: {
            ...prevState.a,
          },
          b: {
            fatorDifusaoB: fatorDifusaoB,
            fatorDecaimento: fatorDecaimento,
            padraoB: valoresPadraoB,
          },
        }));
        break;
      default:
        break;
    }

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
    const camadaExibidaAux = event.target.value;
    setCamadaExibida(camadaExibidaAux);
    simulador.camadaExibida = camadaExibidaAux;
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
            handleAnimationStep={simulador.doAnimationStep.bind(simulador)}
            handleDraw={simulador.draw.bind(simulador)}
            handleMouseMove={handleMouseMove}
            handleMouseDown={handleMouseDown}
            handleTouchMove={handleTouchMove}
          />
        </div>
        <InfoDisplay />
        <Painel
          animate={animate}
          handleClickPlayPause={handleClickPlayPause}
          handleClickReset={handleClickReset}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          camadaExibida={camadaExibida}
          valoresLinhasConfigCamada={valoresLinhasConfigCamada}
        />
      </div>
    </div>
  );
}
