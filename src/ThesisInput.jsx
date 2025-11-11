// src/components/ ThesisInput.jsx
import { useState } from "react";

export function ThesisInput({ onThesisChange }) {
  const [thesis, setThesis] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setThesis(newValue);
    // Si la prop est fournie, on prévient le parent du changement
    if (onThesisChange) {
      onThesisChange(newValue);
    }
  };

  return (
    <div className="thesis-input">
      <label htmlFor="thesis">Votre thesis principale :</label>
      <input
        type="text"
        id="thesis"
        value={thesis}
        onChange={handleChange}
        placeholder="Entrez votre thesis principale..."
        className="thesis-field"
      />
      <button disabled={thesis.trim() === ""}>Ajouter un argument</button>
    </div>
  );
}
