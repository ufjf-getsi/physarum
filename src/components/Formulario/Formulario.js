import React from "react";
import "./formulario.css";

export default function Formulario(props) {
  const { handleClick, handleSubmit, ...rest } = props;

  return (
    <div className="config-container">
      <button className="botao-pause" onClick={(event) => handleClick(event)}>
        Pausar
      </button>
      <form className="formulario" onSubmit={(event) => handleSubmit(event)}>
        <div className="configuracoes">
          <div className="grupo-input">
            <label htmlFor="fatorDecaimentoInput">Fator de decaimento</label>
            <input
              id="fatorDecaimentoInput"
              name="fatorDecaimento"
              type="number"
              min="0"
              max="10"
              step="0.01"
              defaultValue="0.06"
            />
          </div>
          <div className="grupo-input">
            <label htmlFor="fatorDifusaoInput">Fator de difusão</label>
            <input
              id="fatorDifusaoInput"
              name="fatorDifusao"
              type="number"
              min="0"
              max="10"
              step="0.01"
              defaultValue="1.05"
            />
          </div>
        </div>
        <input type="submit" value="Simular" />
      </form>
    </div>
  );
}
