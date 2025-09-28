import { useState, useEffect } from "react";
import styles from "./ArgumentEditForm.module.css";

export function ArgumentEditForm({ argument, onSave, onCancel, references }) {
  const [localArgument, setLocalArgument] = useState(argument);
  const [selectedReferences, setSelectedReferences] = useState(
    argument.references || []
  );

  useEffect(() => {
    setLocalArgument(argument);
    setSelectedReferences(argument.references || []);
  }, [argument]);

  const handleFieldChange = (field, value) => {
    setLocalArgument((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...localArgument,
      references: selectedReferences,
    });
  };

  const toggleReference = (refId) => {
    setSelectedReferences((prev) =>
      prev.includes(refId)
        ? prev.filter((id) => id !== refId)
        : [...prev, refId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      {/* Énoncé principal */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Énoncé de l'argument *</label>
        <input
          type="text"
          className={styles.textInput}
          value={localArgument.text}
          onChange={(e) => handleFieldChange("text", e.target.value)}
          placeholder="Exprimez votre argument..."
          required
        />
      </div>

      {/* Explication détaillée */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Explication (optionnelle)</label>
        <textarea
          className={styles.textarea}
          value={localArgument.textComment || ""}
          onChange={(e) => handleFieldChange("textComment", e.target.value)}
          placeholder="Précisez votre raisonnement, donnez des exemples..."
          rows="3"
        />
      </div>

      {/* Sélecteurs */}
      <div className={styles.selectors}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Position</label>
          <select
            className={styles.select}
            value={localArgument.causa}
            onChange={(e) => handleFieldChange("causa", e.target.value)}
          >
            <option value="pro">Pour ⬆️</option>
            <option value="contra">Contre ⬇️</option>
            <option value="neutralis">Neutre ➡️</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Type</label>
          <select
            className={styles.select}
            value={localArgument.forma}
            onChange={(e) => handleFieldChange("forma", e.target.value)}
          >
            <option value="descriptif">Descriptif</option>
            <option value="normatif">Normatif</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nature</label>
          <select
            className={styles.select}
            value={localArgument.natura}
            onChange={(e) => handleFieldChange("natura", e.target.value)}
          >
            <option value="validity">Validité</option>
            <option value="relevance">Pertinence</option>
          </select>
        </div>
      </div>

      {/* Références */}
      {references && references.length > 0 && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Références associées</label>
          <div className={styles.referencesList}>
            {references.map((ref) => (
              <label key={ref.id} className={styles.referenceItem}>
                <input
                  type="checkbox"
                  checked={selectedReferences.includes(ref.id)}
                  onChange={() => toggleReference(ref.id)}
                  className={styles.checkbox}
                />
                <span className={styles.referenceTitle}>📚 {ref.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          ✗ Annuler
        </button>
        <button type="submit" className={styles.saveButton}>
          💾 Sauvegarder
        </button>
      </div>
    </form>
  );
}
