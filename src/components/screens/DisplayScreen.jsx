// src/components/screens/DisplayScreen.jsx
import { ArgumentTree } from "../ArgumentTree";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { ArgumentForm } from "../forms/ArgumentForm";
import { useState } from "react";

export function DisplayScreen({
  onNewArgumentaire,
  thesis,
  contexte,
  forma,
  onUpdateArgumentaire,
  argumentTree,
  onExport,
  onImportInit,
  onAddArgument,
  onEditArgument,
  onDeleteArgument,
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showArgumentForm, setShowArgumentForm] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState("root");
  const [editingArgument, setEditingArgument] = useState(null);

  if (!argumentTree) {
    return <div>Chargement de l'arbre...</div>;
  }

  // ARGUMENTAIRE MODIFICATION HANDLERS
  const handleEditSave = (formData) => {
    onUpdateArgumentaire(formData);
    setShowEditForm(false);
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  // ARGUMENT HANDLERS
  const handleArgumentSave = (argumentData) => {
    if (editingArgument) {
      // Mode modification - CORRECT
      onEditArgument(editingArgument.id, argumentData);
    } else {
      // Mode création
      onAddArgument(selectedParentId, argumentData);
    }
    setShowArgumentForm(false);
    setEditingArgument(null);
  };

  const handleArgumentCancel = () => {
    setShowArgumentForm(false);
  };

  const handleAddArgumentClick = () => {
    console.log("Add argument clicked");
    setSelectedParentId("root");
    setEditingArgument(null);
    setShowArgumentForm(true);
  };

  const handleEditArgumentClick = (argument) => {
    setEditingArgument(argument); // Stocker l'argument à modifier
    setShowArgumentForm(true);
  };
  //const [selectedParent, setSelectedParent] = useState("root");

  return (
    <div className="display-screen">
      <h1>Mon Argumentaire</h1>

      {/* Affichage des données */}
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
          <button onClick={handleAddArgumentClick}>Ajouter un argument</button>

          <ArgumentTree
            tree={argumentTree}
            onEditArgument={handleEditArgumentClick}
            onDeleteArgument={onDeleteArgument}
          />

          {/* Formulaire d'argument en bas */}
          {showArgumentForm && (
            <div className="argument-form-container">
              <h3>Nouvel argument</h3>
              <ArgumentForm
                parentId={selectedParentId}
                initialData={editingArgument || {}}
                onSave={handleArgumentSave}
                onCancel={handleArgumentCancel}
              />
            </div>
          )}

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
