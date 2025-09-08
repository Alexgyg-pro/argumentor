// ArgumentEditForm.jsx
import { useState, useEffect } from "react";

export function ArgumentEditForm({ argument, onSave, onCancel }) {
  // State local pour chaque propriété éditable
  const [text, setText] = useState(argument.text);
  const [causa, setCausa] = useState(argument.causa);
  // State pour la future propriété 'forma'
  const [forma, setForma] = useState(argument.forma || "deductif"); // Valeur par défaut

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // On rassemble toutes les propriétés modifiées dans un objet
    onSave({
      text: text,
      causa: causa,
      forma: forma,
      // ... d'autres propriétés à venir
    });
  };

  return (
    <form onSubmit={handleSubmit} className="argument-edit-form">
      <label>
        Énoncé:
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
      </label>

      <label>
        Type (Causa):
        <select value={causa} onChange={(e) => setCausa(e.target.value)}>
          <option value="pro">Pour</option>
          <option value="contra">Contre</option>
        </select>
      </label>

      <label>
        Forme (Forma):
        <select value={forma} onChange={(e) => setForma(e.target.value)}>
          <option value="deductif">Déductif</option>
          <option value="inductif">Inductif</option>
          <option value="abductif">Abductif</option>
          {/* Ajoute d'autres options selon tes besoins */}
        </select>
      </label>

      <div className="form-actions">
        <button type="submit">Sauvegarder</button>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
