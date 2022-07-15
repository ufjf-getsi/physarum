import React from "react";

export default function InfoDisplay() {
  return (
    <div className="linha">
      <div className="grupo-info">
        <label htmlFor="ferA">A:</label>
        <p id="infoFerA">0</p>
      </div>
      <div className="grupo-info">
        <label htmlFor="ferB">B:</label>
        <p id="infoFerB">0</p>
      </div>
    </div>
  );
}
