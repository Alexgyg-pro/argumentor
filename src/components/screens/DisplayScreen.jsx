// src/components/screens/DisplayScreen.jsx
import { ArgumentTree } from "../ArgumentTree";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { ArgumentForm } from "../forms/ArgumentForm";
import { HiddenFileInput } from "../common/HiddenFileInput";
import { useState } from "react";

export function DisplayScreen({
  onNewArgumentaire,
  thesis,
  context,
  forma,
  onUpdateArgumentaire,
  argumentTree,
  onExport,
  onImportInit,
  onAddArgument,
  onEditArgument,
  onDeleteArgument,
  fileInputRef,
  onFileSelect,
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

  const handleAddArgumentClick = (parentId = "root") => {
    console.log("handleAddArgumentClick appelé avec parentId:", parentId);
    setSelectedParentId(parentId);
    setEditingArgument(null);
    setShowArgumentForm(true);
  };

  const handleEditArgumentClick = (argument) => {
    setEditingArgument(argument); // Stocker l'argument à modifier
    setShowArgumentForm(true);
  };
  //const [selectedParent, setSelectedParent] = useState("root");

  // const handleAddSubArgumentClick = (parentId) => {
  //   setSelectedParentId(parentId);
  //   setEditingArgument(null); // Mode création
  //   setShowArgumentForm(true);
  // };

  return (
    <div className="display-screen">
      <h1>Mon Argumentaire</h1>

      {/* Affichage des données */}
      {!showEditForm ? (
        <>
          <div className="argumentaire-info">
            <h2>Thèse : {thesis}</h2>
            <p>
              <strong>Contexte :</strong> {context}
            </p>
            <p>
              <strong>Forma :</strong> {forma}
            </p>
            <button onClick={() => setShowEditForm(true)}>
              Modifier l'argumentaire
            </button>
          </div>

          {/* Les arguments */}
          <button onClick={() => handleAddArgumentClick("root")}>
            Ajouter un argument
          </button>

          <ArgumentTree
            tree={argumentTree}
            onAddArgument={handleAddArgumentClick}
            onEditArgument={handleEditArgumentClick}
            onDeleteArgument={onDeleteArgument}
          />

          {/* Formulaire unique */}
          {showArgumentForm && (
            <div className="argument-form-container">
              <h3>
                {editingArgument ? "Modifier l'argument" : "Nouvel argument"}
              </h3>
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
          initialData={{ thesis, context, forma }}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
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
