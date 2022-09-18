import React from "react";
import "./Configuracoes.css";
import ParametrosCamada from "../ParametrosCamada/ParametrosCamada";
import GrupoInput from "../GrupoInput/GrupoInput";

export default function Configuracoes({
  handleSubmit,
  camadaExibida,
  camposDimensoes,
  handleChangeDimensoes,
  camposParametros,
  handleChangeParametros,
}) {
  return (
    <form className="formulario" onSubmit={(event) => handleSubmit(event)}>
      <div id="configuracoes" className="configuracoes">
        <ParametrosCamada
          camadaExibida={camadaExibida}
          camposParametros={camposParametros}
          handleChange={handleChangeParametros}
        />
        <div className="linha dimensoes">
          <GrupoInput
            label="Linhas"
            name="qtdLinhas"
            type="number"
            min="1"
            max="200"
            step="1"
            value={camposDimensoes.qtdLinhas}
            handleChange={(event) => handleChangeDimensoes(event)}
          />
          <GrupoInput
            label="Colunas"
            name="qtdColunas"
            type="number"
            min="1"
            max="200"
            step="1"
            value={camposDimensoes.qtdColunas}
            handleChange={(event) => handleChangeDimensoes(event)}
          />
          <GrupoInput
            label="Tamanho"
            name="tamanho"
            type="number"
            min="5"
            max="10"
            step="1"
            value={camposDimensoes.tamanho}
            handleChange={(event) => handleChangeDimensoes(event)}
          />
        </div>
      </div>
      <input type="submit" value="Mudar parâmetros" />
    </form>
  );
}
