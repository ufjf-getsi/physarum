import React from "react";

export default function InfoConcentracao() {
  return (
    <div className="linha">
      <div className="grupo-info">
        <label htmlFor="infoA">A:</label>
        <p id="infoA">0</p>
      </div>
      <div className="grupo-info">
        <label htmlFor="infoB">B:</label>
        <p id="infoB">0</p>
      </div>
      <div className="grupo-info">
        <label htmlFor="infoC">C:</label>
        <p id="infoC">0</p>
      </div>
    </div>
  );
}
