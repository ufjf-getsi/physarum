import React from "react";
import "./painel.css";
import Formulario from "./../../components/Formulario/Formulario";

export default function Painel({
  animate,
  handleClickPlayPause,
  handleClickReset,
  handleSubmit,
  handleChange,
}) {
  return (
    <div className="linha painel-inferior">
      <div className="coluna">
        <div className="grupo-input">
          <label htmlFor="camadaSelect">Camada</label>
          <select
            id="camadaSelect"
            className="camada-select"
            name="camada"
            defaultValue={"A"}
            onChange={(event) => handleChange(event)}
          >
            <option value="a">A</option>
            <option value="b">B</option>
          </select>
        </div>
      </div>
      <div className="coluna">
        <div className="config-container">
          <div className="linha painel-botoes-controle">
            <div className="coluna">
              <button
                id="botaoPause"
                className="botao-pause"
                onClick={handleClickPlayPause}
              >
                {animate ? "⏸ Pausar" : "▶ Continuar"}
              </button>
            </div>
            <div className="coluna">
              <button
                id="botaoReiniciar"
                className="botao-reiniciar"
                onClick={handleClickReset}
              >
                Reiniciar
              </button>
            </div>
          </div>
          <Formulario handleSubmit={handleSubmit} />
        </div>
      </div>
      <div className="coluna">
        <div className="grupo-escala">
          <div id="escala"></div>
          <div className="linha">
            <span>0</span>
            <span id="infoIntensidadeMaxima">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
