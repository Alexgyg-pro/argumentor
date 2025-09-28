import { useState, useEffect } from "react";
import styles from "./ThesisEditor.module.css";

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
    setLocalThesis(thesis);
    onCancel();
  };

  // Met à jour la copie locale quand on édite un champ
  const handleFieldChange = (field, value) => {
    const updatedThesis = { ...localThesis, [field]: value };
    setLocalThesis(updatedThesis);

    // ⭐ IMPORTANT : Notifier le parent du changement
    if (onThesisChange) {
      onThesisChange(updatedThesis);
    }
  };

  if (isEditing || !thesis.text || thesis.text.trim() === "") {
    // MODE ÉDITION
    return (
      <div className={styles.thesisEditor}>
        <label>Votre thèse principale :</label>
        <textarea
          className={styles.textarea}
          value={localThesis.text}
          onChange={(e) => handleFieldChange("text", e.target.value)}
          placeholder="Énoncez votre proposition principale..."
        />

        <label>Forme logique :</label>
        <select
          className={styles.select}
          value={localThesis.forma}
          onChange={(e) => handleFieldChange("forma", e.target.value)}
        >
          <option value="descriptif">Descriptif</option>
          <option value="normatif">Normatif</option>
          <option disabled value="esthétique">
            Esthétique (bientôt disponible)
          </option>
        </select>

        {/* <div className={styles.thesisEditorActions}>
          <button onClick={handleSave}>💾 Sauvegarder</button>
          <button onClick={handleCancel}>✗ Annuler</button>
        </div> */}
      </div>
    );
  }

  // MODE AFFICHAGE
  return (
    <div className={styles.thesisEditor}>
      <label>Votre thèse principale :</label>
      <textarea
        className={styles.textarea}
        value={localThesis.text}
        onChange={(e) => handleFieldChange("text", e.target.value)}
        placeholder="Énoncez votre proposition principale..."
        rows="3"
      />

      <label>Forme logique :</label>
      <select
        className={styles.select}
        value={localThesis.forma}
        onChange={(e) => handleFieldChange("forma", e.target.value)}
      >
        <option value="descriptif">Descriptif</option>
        <option value="normatif">Normatif</option>
        <option disabled value="esthétique">
          Esthétique (bientôt disponible)
        </option>
      </select>

      <div className={styles.thesisEditorActions}>
        <button onClick={handleSave} className={styles.primaryButton}>
          💾 Sauvegarder
        </button>
        <button onClick={handleCancel} className={styles.secondaryButton}>
          ✗ Annuler
        </button>
      </div>
    </div>
  );
}
