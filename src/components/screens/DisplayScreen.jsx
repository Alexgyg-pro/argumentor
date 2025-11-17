// src/components/screens/DisplayScreen.jsx
import { ArgumentTree } from "../ArgumentTree";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { useState } from "react";

export function DisplayScreen({
  onNewArgumentaire,
  thesis,
  //onThesisChange,
  contexte,
  forma,
  onUpdateArgumentaire, // Nouvelle prop
  argumentTree,
  onExport,
  onImportInit,
  onAddArgument,
  onDeleteArgument,
}) {
  const [showEditForm, setShowEditForm] = useState(false);

  if (!argumentTree) {
    return <div>Chargement de l'arbre...</div>;
  }

  const handleEditSave = (formData) => {
    onUpdateArgumentaire(formData);
    setShowEditForm(false);
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  const [selectedParent, setSelectedParent] = useState("root");

  return (
    <div className="display-screen">
      <h1>Mon Argumentaire</h1>

      {/* Affichage des données (l'input a disparu) */}
      {!showEditForm ? (
        <>
          <div className="argumentaire-info">
            <h2>Thèse : {thesis}</h2>
            <p>
              <strong>Contexte :</strong> {contexte}
            </p>
            <p>
              <strong>Forma :</strong> {forma}
            </p>
            <button onClick={() => setShowEditForm(true)}>
              Modifier l'argumentaire
            </button>
          </div>

          {/* Les arguments */}
          <button
            onClick={() => onAddArgument("root", { claim: "Nouvel argument" })}
          >
            Ajouter un argument
          </button>

          <ArgumentTree
            tree={argumentTree}
            onDeleteArgument={onDeleteArgument}
          />

          <button onClick={onExport}>Exporter</button>
          <button onClick={onNewArgumentaire}>Nouvel argumentaire</button>
          <button onClick={onImportInit}>Ouvrir un argumentaire</button>
        </>
      ) : (
        <ArgumentaireForm
          initialData={{ thesis, contexte, forma }}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
}
