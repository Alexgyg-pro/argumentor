// src/components/screens/StartScreen.jsx
import { useState } from "react";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { HiddenFileInput } from "../common/HiddenFileInput";
import styles from "./StartScreen.module.css";

export function StartScreen({
  onNewArgumentaire,
  onImportInit,
  fileInputRef,
  onFileSelect,
}) {
  const [showForm, setShowForm] = useState(false);

  const handleNewClick = () => {
    setShowForm(true);
  };

  const handleFormSave = (formData) => {
    // Ici on va initialiser l'argumentaire avec les données du formulaire
    onNewArgumentaire(formData);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };
  return (
    <div className={styles.startscreen}>
      <div className={styles.container}>
        <h1 className={styles.title}>Bienvenue dans Argumentor</h1>

        {!showForm ? (
          <div className={styles.actions}>
            <button onClick={handleNewClick} className={styles.primaryButton}>
              Nouveau
            </button>
            <button onClick={onImportInit} className={styles.secondaryButton}>
              Importer
            </button>
          </div>
        ) : (
          <ArgumentaireForm
            initialData={{}}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}

        {/* Input file caché pour l'import */}
        <HiddenFileInput
          fileInputRef={fileInputRef}
          onFileSelect={onFileSelect}
        />
      </div>
    </div>
  );
}
