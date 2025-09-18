// ArgumentEditForm.jsx
import { useState, useEffect } from "react";

export function ArgumentEditForm({ argument, onSave, onCancel }) {
  const [text, setText] = useState(argument.text);
  const [causa, setCausa] = useState(argument.causa);
  const [forma, setForma] = useState(argument.forma || "descriptif");
  const [validity, setValidity] = useState(argument.validity ?? 0.5);
  const [relevance, setRelevance] = useState(argument.relevance ?? 0.5);
  const [value, setValue] = useState((argument.value ?? 0.5).toFixed(2));
  const [natura, setNatura] = useState(argument.natura || "validity");

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // On rassemble toutes les propriétés modifiées dans un objet
    onSave({
      text: text,
      causa: causa,
      forma: forma,
      validity: validity,
      relevance: relevance,
      natura: natura,
      value: parseFloat(value),
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
          <option value="neutralis">⏺️ Neutre</option>
          <option value="pro">✅ Pour</option>
          <option value="contra">❌ Contre</option>
        </select>
      </label>
      <label>
        Forme (Forma):
        <select value={forma} onChange={(e) => setForma(e.target.value)}>
          <option value="descriptif">Descriptif</option>
          <option value="normatif">Normatif</option>
          <option disabled value="esthétique">
            Esthétique (bientôt disponible)
          </option>
        </select>
      </label>
      {argument.children.length === 0 ? (
        <label>
          Valeur (0-1):
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        </label>
      ) : (
        <div>
          <p>Validité: {argument.validity?.toFixed(1)} (calculée)</p>
          <p>Pertinence: {argument.relevance?.toFixed(1)} (calculée)</p>
        </div>
      )}
      <label>
        Nature de l'argument :
        <select value={natura} onChange={(e) => setNatura(e.target.value)}>
          <option value="validity">Validité</option>
          <option value="relevance">Pertinence</option>
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
