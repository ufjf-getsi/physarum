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
          <div className="linha">
            <div className="coluna">
              <div className="grupo-input">
                <label htmlFor="fatorDecaimentoInput">Decaimento</label>
                <input
                  id="fatorDecaimentoInput"
                  name="fatorDecaimento"
                  type="number"
                  min="0"
                  max="10"
                  step="0.001"
                  defaultValue="0.062"
                />
              </div>
              <div className="grupo-input">
                <label htmlFor="fatorAdicaoInput">Adição</label>
                <input
                  id="fatorAdicaoInput"
                  name="fatorAdicao"
                  type="number"
                  min="0"
                  max="10"
                  step="0.001"
                  defaultValue="0.055"
                />
              </div>
            </div>
            <div className="coluna">
              <div className="grupo-input">
                <label htmlFor="fatorDifusaoAInput">Difusão de A</label>
                <input
                  id="fatorDifusaoAInput"
                  name="fatorDifusaoA"
                  type="number"
                  min="0"
                  max="10"
                  step="0.001"
                  defaultValue="1"
                />
              </div>
              <div className="grupo-input">
                <label htmlFor="fatorDifusaoBInput">Difusão de B</label>
                <input
                  id="fatorDifusaoBInput"
                  name="fatorDifusaoB"
                  type="number"
                  min="0"
                  max="10"
                  step="0.001"
                  defaultValue="0.5"
                />
              </div>
            </div>
            <div className="coluna">
              <div className="grupo-input">
                <label htmlFor="qtdLinhasInput">Linhas</label>
                <input
                  id="qtdLinhasInput"
                  name="qtdLinhas"
                  type="number"
                  min="1"
                  max="200"
                  step="1"
                  defaultValue="50"
                />
              </div>
              <div className="grupo-input">
                <label htmlFor="qtdColunasInput">Colunas</label>
                <input
                  id="qtdColunasInput"
                  name="qtdColunas"
                  type="number"
                  min="1"
                  max="200"
                  step="1"
                  defaultValue="50"
                />
              </div>
            </div>
          </div>
        </div>
        <input type="submit" value="Simular" />
      </form>
    </div>
  );
}
