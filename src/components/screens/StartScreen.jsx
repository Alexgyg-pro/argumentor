// src/components/screens/StartScreen.jsx
import { useState } from "react";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";

export function StartScreen({ onNewArgumentaire, onImportInit }) {
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
    </div>
  );
}
