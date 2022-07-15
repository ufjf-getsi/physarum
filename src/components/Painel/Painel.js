import React from "react";
import "./painel.css";
import Formulario from "./../../components/Formulario/Formulario";

export default function Painel({ animate, handleClick, handleSubmit, handleChange}){

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
        <Formulario animate={animate} handleClick={handleClick} handleSubmit={handleSubmit} />
      </div>
      <div className="coluna"></div>
    </div>
  );
}
