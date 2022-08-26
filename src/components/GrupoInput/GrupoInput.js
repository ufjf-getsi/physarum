import React from "react";
import "./GrupoInput.css";

export default function GrupoInput({
  label,
  name,
  type,
  min,
  max,
  step,
  value,
  handleChange,
  camada,
}) {
  const id = `${name}${camada ? camada.toUpperCase() : ""}Input`;
  return (
    <div className="coluna">
      <div className="grupo-input">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          name={name}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => handleChange(event)}
          data-camada={camada}
        />
      </div>
    </div>
  );
}
