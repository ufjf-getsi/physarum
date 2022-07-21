import React from "react";

export default function LinhasConfigCamada({
  camadaExibida,
  valoresLinhasConfigCamada,
  alteraCorCampo,
  classeCampoLCC,
}) {
  return (
    <div id="linhasConfigCamada">
      <div
        className="linha"
        key="linhaA"
        style={{ display: camadaExibida === "a" ? "flex" : "none" }}
      >
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
              defaultValue={valoresLinhasConfigCamada.a.fatorDifusaoA}
              onChange={(event) => alteraCorCampo(event)}
              className={classeCampoLCC[0]}
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
              defaultValue={valoresLinhasConfigCamada.a.fatorAdicao}
              onChange={(event) => alteraCorCampo(event)}
              className={classeCampoLCC[1]}
            />
          </div>
        </div>

        <div className="coluna">
          <div className="grupo-input">
            <label htmlFor="padraoASelect">Padrão</label>
            <select
              id="padraoASelect"
              name="padraoA"
              defaultValue={valoresLinhasConfigCamada.a.padraoA}
              onChange={(event) => alteraCorCampo(event)}
              className={classeCampoLCC[2]}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="A">Aleatório</option>
            </select>
          </div>
        </div>
      </div>
      <div
        className="linha"
        key="linhaB"
        style={{ display: camadaExibida === "b" ? "flex" : "none" }}
      >
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
              defaultValue={valoresLinhasConfigCamada.b.fatorDifusaoB}
              onChange={(event) => alteraCorCampo(event)}
              className={classeCampoLCC[3]}
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
              defaultValue={valoresLinhasConfigCamada.b.fatorDecaimento}
              onChange={(event) => alteraCorCampo(event)}
              className={classeCampoLCC[4]}
            />
          </div>
        </div>

        <div className="coluna">
          <div className="grupo-input">
            <label htmlFor="padraoBSelect">Padrão</label>
            <select
              id="padraoBSelect"
              name="padraoB"
              defaultValue={valoresLinhasConfigCamada.b.padraoB}
              onChange={(event) => alteraCorCampo(event)}
              className={classeCampoLCC[5]}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="A">Aleatório</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
