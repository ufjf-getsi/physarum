import React, { useState } from "react";
import "./App.css";
import InfoConcentracao from "./components/InfoConcentracao/InfoConcentracao";
import TelaAnimacao from "./components/TelaAnimacao/TelaAnimacao";
import Painel from "./components/Painel/Painel";

import Simulador from "./Simulador";

const simulador = new Simulador(50, 50);
simulador.simulacaoPermitida = false;

export default function App() {
  const [animate, setAnimate] = useState(false);
  const [camadaExibida, setCamadaExibida] = useState("a");
  const [camposParametros, setCamposParametros] = useState({
    a: { fatorDifusao: 1, fatorAdicao: 0.055, padrao: "A" },
    b: { fatorDifusao: 0.5, fatorDecaimento: 0.062, padrao: "A" },
    c: { fatorDifusao: 1, fatorDecaimento: 0.01, padrao: "A" },
  });
  const [camposDimensoes, setCamposDimensoes] = useState({
    qtdLinhas: "50",
    qtdColunas: "50",
    tamanho: "7",
  });

  // Gerenciadores de eventos
  const handleMouseMove = (event) => {
    event.preventDefault();
    if (simulador.desenhoPermitido) {
      simulador.depositaIntensidade(event);
      simulador.draw();
    }
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
  const handleClickPlayPause = () => {
    setAnimate(!animate);
  };
  const handleClickReset = () => {
    simulador.inicializarComValoresPadrao();
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    switch (camadaExibida) {
      case "a":
        simulador.fatorDifusao.a = Number(camposParametros.a.fatorDifusao);
        simulador.fatorAdicao = Number(camposParametros.a.fatorAdicao);
        simulador.valoresPadrao.a = camposParametros.a.padrao;
        break;
      case "b":
        simulador.fatorDifusao.b = Number(camposParametros.b.fatorDifusao);
        simulador.fatorDecaimento = Number(camposParametros.b.fatorDecaimento);
        simulador.valoresPadrao.b = camposParametros.b.padrao;
        break;
      case "c":
        simulador.fatorDifusao.c = Number(camposParametros.b.fatorDifusao);
        simulador.fatorDecaimentoC = Number(camposParametros.c.fatorDecaimento);
        simulador.valoresPadrao.c = camposParametros.c.padrao;
        break;
      default:
        break;
    }

    let linhasForm = parseInt(camposDimensoes.qtdLinhas);
    let colunasForm = parseInt(camposDimensoes.qtdColunas);
    let tamanhoForm = parseInt(camposDimensoes.tamanho);

    if (
      linhasForm !== simulador.LINHAS ||
      colunasForm !== simulador.COLUNAS ||
      tamanhoForm !== simulador.TAMANHO
    ) {
      simulador.mudarTamanho(linhasForm, colunasForm, tamanhoForm);

      const canvas = document.querySelector("canvas");
      canvas.setAttribute("width", simulador.COLUNAS * simulador.TAMANHO);
      canvas.setAttribute("height", simulador.LINHAS * simulador.TAMANHO);
    }

    limpaDecoracaoCampos();
  };
  const handleChangeCamada = (event) => {
    const camadaExibidaAux = event.target.value;
    setCamadaExibida(camadaExibidaAux);
    simulador.camadaExibida = camadaExibidaAux;
  };
  const handleChangeDimensoes = (event) => {
    const elemento = event.target;
    setCamposDimensoes({
      ...camposDimensoes,
      [elemento.name]: elemento.value,
    });
    elemento.classList.add("alterado");
  };
  const handleChangeParametros = (event) => {
    const elemento = event.target;
    setCamposParametros({
      ...camposParametros,
      [camadaExibida]: {
        ...camposParametros[camadaExibida],
        [elemento.name]: elemento.value,
      },
    });
    elemento.classList.add("alterado");
  };

  function limpaDecoracaoCampos() {
    const listaElementos = document.querySelectorAll(
      `[data-camada="${camadaExibida}"], .dimensoes input`
    );
    for (const elemento of listaElementos) {
      elemento.classList.remove("alterado");
    }
  }

  //Testes
  // simulacao.plano[Math.floor(LINHAS / 2)][Math.floor(COLUNAS / 2)].a = 10;

  return (
    <div className="app">
      <div className="app-container">
        <div>
          <TelaAnimacao
            simulador={simulador}
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
        <InfoConcentracao />
        <Painel
          animate={animate}
          handleClickPlayPause={handleClickPlayPause}
          handleClickReset={handleClickReset}
          handleSubmit={handleSubmit}
          handleChangeCamada={handleChangeCamada}
          handleChangeDimensoes={handleChangeDimensoes}
          handleChangeParametros={handleChangeParametros}
          camadaExibida={camadaExibida}
          camposDimensoes={camposDimensoes}
          camposParametros={camposParametros}
        />
      </div>
    </div>
  );
}
