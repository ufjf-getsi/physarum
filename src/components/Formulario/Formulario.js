import React, { useState } from "react";
import "./formulario.css";

export default function Formulario({ handleSubmit, camadaExibida }) {
  const linhasConfigCamada = [];
  linhasConfigCamada.push(
    <div className="linha" key="linhaA">
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
      </div>

      <div className="coluna">
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
          <label htmlFor="padraoASelect">Padrão</label>
          <select id="padraoASelect" name="padraoA" defaultValue={"A"}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="A">Aleatório</option>
          </select>
        </div>
      </div>
    </div>
  );
  linhasConfigCamada.push(
    <div className="linha" key="linhaB">
      <div className="coluna">
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
      </div>

      <div className="coluna">
        <div className="grupo-input">
          <label htmlFor="padraoBSelect">Padrão</label>
          <select id="padraoBSelect" name="padraoB" defaultValue={"A"}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="A">Aleatório</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <form className="formulario" onSubmit={(event) => handleSubmit(event)}>
      <div className="configuracoes">
        {linhasConfigCamada[camadaExibida.charCodeAt(0) - 97]}
        <div className="linha">
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
          </div>

          <div className="coluna">
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

          <div className="coluna">
            <div className="grupo-input">
              <label htmlFor="tamanhoInput">Tamanho</label>
              <input
                id="tamanhoInput"
                name="tamanho"
                type="number"
                min="5"
                max="10"
                step="1"
                defaultValue="7"
              />
            </div>
          </div>
        </div>
      </div>
      <input type="submit" value="Mudar parâmetros" />
    </form>
  );
}
