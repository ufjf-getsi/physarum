import React from "react";
import GrupoInput from "../GrupoInput/GrupoInput";
import GrupoSelect from "../GrupoSelect/GrupoSelect";

export default function ParametrosCamada({
  camadaExibida,
  camposParametros,
  handleChange,
}) {
  function letraDoAlfabeto(indice) {
    return String.fromCharCode(97 + indice);
  }
  let linhas = [];
  for (let int = 0; int < 3; int++) {
    const camada = letraDoAlfabeto(int);
    const camadaMaiusculo = camada.toUpperCase();
    const fatorCamada =
      camada === "a" ? "Adicao" : camada === "b" ? "Decaimento" : "Quimiotaxia";
    const linha = (
      <div
        className="linha"
        key={"linha" + camadaMaiusculo}
        style={{ display: camadaExibida === camada ? "flex" : "none" }}
      >
        <GrupoInput
          label={"Difusão de " + camadaMaiusculo}
          name="fatorDifusao"
          type="number"
          min="0"
          max="10"
          step="0.001"
          value={camposParametros[camada].fatorDifusao}
          handleChange={(event) => handleChange(event)}
          camada={camada}
        />
        <GrupoInput
          label={fatorCamada}
          name={`fator${fatorCamada}`}
          type="number"
          min="0"
          max="10"
          step="0.001"
          value={camposParametros[camada][`fator${fatorCamada}`]}
          handleChange={(event) => handleChange(event)}
          camada={camada}
        />
        <GrupoSelect
          label="Padrao"
          name="padrao"
          value={camposParametros[camada].padrao}
          handleChange={(event) => handleChange(event)}
          camada={camada}
        />
      </div>
    );
    linhas.push(linha);
  }
  return <div id="parametrosCamada">{linhas}</div>;
}
