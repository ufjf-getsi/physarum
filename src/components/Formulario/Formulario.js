import React, { useState } from "react";
import "./Formulario.css";
import LinhasConfigCamada from "./../../components/LinhasConfigCamada/LinhasConfigCamada";

export default function Formulario({
  handleSubmit,
  camadaExibida,
  valoresLinhasConfigCamada,
}) {
  const [classeCampoLCC, setClasseCampoLCC] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  function alteraCorCampo(event) {
    const elemento = event.target;
    if (
      elemento.parentElement.parentElement.parentElement.parentElement.id ===
      "linhasConfigCamada"
    ) {
      const campos = document.querySelectorAll(
        "#linhasConfigCamada input, #linhasConfigCamada select"
      );
      const indice = Array.prototype.indexOf.call(campos, elemento);
      classeCampoLCC[indice] = "alterado";
      setClasseCampoLCC([...classeCampoLCC]);
    } else elemento.classList.add("alterado");
  }

  function limpaDecoracaoCampos() {
    const camadaExibidaInt = camadaExibida.charCodeAt(0) - 97;
    for (let int = 0; int < 3; int++) {
      const indice = camadaExibidaInt * 3 + int;
      classeCampoLCC[indice] = "";
    }
    setClasseCampoLCC([...classeCampoLCC]);
    const linhaInferior = document.getElementById("configuracoes").children[1];
    for (const coluna of linhaInferior.children) {
      const elemento = coluna.firstChild.children[1];
      elemento.classList.remove("alterado");
    }
  }

  return (
    <form className="formulario" onSubmit={(event) => handleSubmit(event)}>
      <div id="configuracoes" className="configuracoes">
        <LinhasConfigCamada
          camadaExibida={camadaExibida}
          valoresLinhasConfigCamada={valoresLinhasConfigCamada}
          alteraCorCampo={alteraCorCampo}
          classeCampoLCC={classeCampoLCC}
        />
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
                onChange={(event) => alteraCorCampo(event)}
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
                onChange={(event) => alteraCorCampo(event)}
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
                onChange={(event) => alteraCorCampo(event)}
              />
            </div>
          </div>
        </div>
      </div>
      <input
        type="submit"
        value="Mudar parâmetros"
        onClick={limpaDecoracaoCampos}
      />
    </form>
  );
}
