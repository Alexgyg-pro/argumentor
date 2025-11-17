// src/components/screens/StartScreen.jsx
import { useState } from "react";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { HiddenFileInput } from "../common/HiddenFileInput";

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
    <div className="start-screen">
      <h1>Argumentor</h1>

      {!showForm ? (
        <>
          <button onClick={handleNewClick}>Nouvel argumentaire</button>
          <button onClick={onImportInit}>Ouvrir un argumentaire</button>
        </>
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
  );
}
