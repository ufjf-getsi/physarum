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
    if (simulador.animacaoPermitida) {
      event.currentTarget.innerText = "Continuar";
    }
    else {
      event.currentTarget.innerText = "Pausar";
    }
    simulador.animacaoPermitida = !simulador.animacaoPermitida;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formInputs = event.target.querySelectorAll("input");
    const inputValues = Array.from(formInputs, (x) => x.value);
    simulador.fatorAdicao = Number(inputValues[0]);
    simulador.fatorDecaimento = Number(inputValues[1]);
    simulador.fatorDifusao.a = Number(inputValues[2]);
    simulador.fatorDifusao.b = Number(inputValues[3]);
    let linhasForm = parseInt(inputValues[4]);
    let colunasForm = parseInt(inputValues[5]);

    if (linhasForm !== simulador.LINHAS || colunasForm !== simulador.COLUNAS) {
      simulador.mudarTamanho(linhasForm, colunasForm);
      
      const canvas = document.querySelector("canvas");
      canvas.setAttribute("width", simulador.COLUNAS * 10);
      canvas.setAttribute("height", simulador.LINHAS * 10);
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




