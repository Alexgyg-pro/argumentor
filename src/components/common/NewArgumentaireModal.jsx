// src/components/common/NewArgumentaireModal.jsx
import { useState } from "react";
import { ThesisEditor } from "../thesis/ThesisEditor";
import styles from "./NewArgumentaireModal.module.css";

export function NewArgumentaireModal({ isOpen, onSave, onCancel }) {
  const [localThesis, setLocalThesis] = useState({
    text: "",
    forma: "descriptif",
  });

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!localThesis.text.trim()) {
      alert("Veuillez saisir une thèse");
      return;
    }
    onSave(localThesis);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Créer un nouvel argumentaire</h2>

        <ThesisEditor
          thesis={localThesis}
          onThesisChange={(updatedThesis) => {
            setLocalThesis(updatedThesis);
          }}
          onCancel={onCancel}
          isNewThesis={true}
        />

        <div className={styles.modalActions}>
          <button
            onClick={handleCreate}
            className={styles.primaryButton}
            disabled={!localThesis.text.trim()}
          >
            💾 Créer l'argumentaire
          </button>
          <button onClick={onCancel} className={styles.secondaryButton}>
            ✗ Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
