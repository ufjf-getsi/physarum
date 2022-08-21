import React from "react";
import "./Painel.css";
import Formulario from "./../../components/Formulario/Formulario";

export default function Painel({
  animate,
  handleClickPlayPause,
  handleClickReset,
  handleSubmit,
  handleChangeCamada,
  handleChangeDimensoes,
  handleChangeParametros,
  camadaExibida,
  camposDimensoes,
  camposParametros,
}) {
  return (
    <div className="linha painel-inferior">
      <div className="">
        <div className="grupo-input">
          <label htmlFor="camadaSelect">Camada</label>
          <select
            id="camadaSelect"
            className="camada-select"
            name="camada"
            defaultValue={"A"}
            onChange={(event) => handleChangeCamada(event)}
          >
            <option value="a">A</option>
            <option value="b">B</option>
          </select>
        </div>
      </div>
      <div>
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
          <Formulario
            handleSubmit={handleSubmit}
            camadaExibida={camadaExibida}
            camposDimensoes={camposDimensoes}
            camposParametros={camposParametros}
            handleChangeDimensoes={handleChangeDimensoes}
            handleChangeParametros={handleChangeParametros}
          />
        </div>
      </div>
      <div className="">
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
