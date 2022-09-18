import React from "react";
import "../GrupoInput/GrupoInput.css";

export default function GrupoSelect({
  label,
  name,
  value,
  handleChange,
  camada,
}) {
  const id = name + camada.toUpperCase() + "Select";
  return (
    <div className="coluna">
      <div className="grupo-input">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => handleChange(event)}
          data-camada={camada}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="A">Aleatório</option>
        </select>
      </div>
    </div>
  );
}
