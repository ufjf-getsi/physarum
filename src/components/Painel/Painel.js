import React from "react";
import "./painel.css";
import Formulario from "./../../components/Formulario/Formulario";

export default function Painel(props) {
  const { handleClick, handleSubmit, ...rest } = props;

  return (
    <div className="linha painel-inferior">
      <div className="coluna">
        <div className="grupo-input">
          <label htmlFor="camadaSelect">Camada</label>
          <select id="camadaSelect" name="camada" defaultValue={"A"}>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
      </div>
      <div className="coluna">
        <Formulario handleClick={handleClick} handleSubmit={handleSubmit} />
      </div>
      <div className="coluna"></div>
    </div>
  );
}
