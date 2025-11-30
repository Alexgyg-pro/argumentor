// src/components/screens/StartScreen.jsx
import { useState, useEffect } from "react";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { HiddenFileInput } from "../common/HiddenFileInput";
import styles from "./StartScreen.module.css";

/**
 * Écran d'accueil de l'application
 * @param {Function} onNewArgumentaire - Créer un nouvel argumentaire
 * @param {Function} onImportInit - Ouvrir l'explorateur de fichiers
 * @param {Object} fileInputRef - Référence vers l'input file caché
 * @param {Function} onFileSelect - Gérer la sélection de fichier
 */
export function StartScreen({
  onNewArgumentaire,
  onImportInit,
  fileInputRef,
  onFileSelect,
  autoShowForm = false,
}) {
  const [showForm, setShowForm] = useState(autoShowForm);

  useEffect(() => {
    setShowForm(autoShowForm);
  }, [autoShowForm]);

  const handleNewClick = () => {
    setShowForm(true);
  };

  const handleFormSave = (formData) => {
    // Ici on va initialiser l'argumentaire avec les données du formulaire
    onNewArgumentaire(formData, false);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };
  return (
    <div className={styles.startscreen}>
      <div className={styles.container}>
        {!showForm ? (
          <>
            <h1 className={styles.title}>Bienvenue dans Argumentor</h1>
            <div className={styles.actions}>
              <button onClick={handleNewClick} className={styles.primaryButton}>
                Nouveau
              </button>
              <button onClick={onImportInit} className={styles.secondaryButton}>
                Importer
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className={styles.title}>Nouvel argumentaire</h3>
            <ArgumentaireForm
              initialData={{}}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </>
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
