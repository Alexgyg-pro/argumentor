// ThesisEditor.jsx
import { useState } from "react";

export function ThesisEditor({ thesis, onThesisChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localThesis, setLocalThesis] = useState(thesis);

  // Sauvegarde les modifications et quitte le mode édition
  const handleSave = () => {
    onThesisChange(localThesis); // Envoie toute la thèse mise à jour
    setIsEditing(false);
  };

  // Annule les modifications et revient au mode affichage
  const handleCancel = () => {
    setLocalThesis(thesis); // Reset les modifications locales
    setIsEditing(false);
  };

  // Met à jour la copie locale quand on édite un champ
  const handleFieldChange = (field, value) => {
    setLocalThesis((prev) => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    // MODE ÉDITION
    return (
      <div className="thesis-editor editing">
        <label>Votre thèse principale :</label>
        <textarea
          value={localThesis.text}
          onChange={(e) => handleFieldChange("text", e.target.value)}
          placeholder="Énoncez votre proposition principale..."
          rows="3"
        />

        <label>Forme logique :</label>
        <select
          value={localThesis.forma}
          onChange={(e) => handleFieldChange("forma", e.target.value)}
        >
          <option value="descriptif">Descriptif</option>
          <option value="normatif">Normatif</option>
          <option disabled value="esthétique">
            Esthétique (bientôt disponible)
          </option>
        </select>

        <div className="thesis-actions">
          <button onClick={handleSave}>💾 Sauvegarder</button>
          <button onClick={handleCancel}>✗ Annuler</button>
        </div>
      </div>
    );
  }

  // MODE AFFICHAGE
  return (
    <div className="thesis-display">
      <h2>Thèse principale</h2>
      <div className="thesis-content">
        <p>{thesis.text}</p>
        <small>Forme: {thesis.forma}</small>
      </div>
      <button onClick={() => setIsEditing(true)}>✏️ Modifier</button>
    </div>
  );
}
