// ThesisEditor.jsx
import { useState, useEffect } from "react";

export function ThesisEditor({
  thesis,
  onThesisChange,
  onCancel,
  isNewThesis,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localThesis, setLocalThesis] = useState(thesis);

  useEffect(() => {
    if (!thesis.text || thesis.text.trim() === "") {
      setIsEditing(true);
    }
  }, [thesis.text]);

  // Sauvegarde les modifications et quitte le mode édition
  const handleSave = () => {
    onThesisChange(localThesis); // Envoie toute la thèse mise à jour
    setIsEditing(false);
  };

  // Annule les modifications et revient au mode affichage
  const handleCancel = () => {
    console.log("🔄 handleCancel (ThesisEditor) appelé");
    setLocalThesis(thesis);
    onCancel(); // ← Appeler la fonction parente
  };

  // Met à jour la copie locale quand on édite un champ
  const handleFieldChange = (field, value) => {
    setLocalThesis((prev) => ({ ...prev, [field]: value }));
  };

  if (isEditing || !thesis.text || thesis.text.trim() === "") {
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
      <h2>{thesis.text}</h2>
      <div className="thesis-content">
        <small>Forme: {thesis.forma}</small>
      </div>
      <button onClick={() => setIsEditing(true)}>
        {thesis.text ? "✏️ Modifier" : "➕ Définir la thèse"}
      </button>
    </div>
  );
}
