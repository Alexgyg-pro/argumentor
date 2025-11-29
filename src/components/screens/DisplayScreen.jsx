// src/components/screens/DisplayScreen.jsx
import { ArgumentTree } from "../ArgumentTree";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";
import { ArgumentForm } from "../forms/ArgumentForm";
import { HiddenFileInput } from "../common/HiddenFileInput";
import { useState } from "react";
import styles from "./DisplayScreen.module.css";

/**
 * Écran principal d'affichage et d'édition de l'argumentaire
 *
 * @param {Object} argumentaire - L'état complet de l'argumentaire
 * @param {Function} onNewArgumentaire - Créer un nouvel argumentaire (réinitialise tout)
 * @param {string} thesis - La thèse principale de l'argumentaire
 * @param {string} context - Le contexte de la thèse
 * @param {string} forma - La forme de la thèse (descriptif, normatif, etc.)
 * @param {Function} onUpdateArgumentaire - Mettre à jour les métadonnées de l'argumentaire
 * @param {Object} argumentTree - La structure arborescente des arguments
 * @param {Function} onAddArgument - Ajouter un nouvel argument
 * @param {Function} onEditArgument - Modifier un argument existant
 * @param {Function} onDeleteArgument - Supprimer un argument
 * @param {Function} onExport - Exporter l'argumentaire en JSON
 * @param {Function} onImportInit - Ouvrir l'explorateur de fichiers pour importer
 * @param {Object} fileInputRef - Référence vers l'input file caché
 * @param {Function} onFileSelect - Gérer la sélection de fichier d'import
 */
export function DisplayScreen({
  argumentaire,
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
  const [activeTab, setActiveTab] = useState("arguments");

  console.log("ArgumentTree:", argumentTree.children.length);
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
    <div className={styles.displayScreen}>
      <main>
        <div>
          <div className={styles.thesisCard}>
            <div className={styles.thesisHeader}>
              <h2 className={styles.thesisTitle}>{argumentaire.thesis}</h2>
              <span className={styles.thesisForma}>{argumentaire.forma}</span>
            </div>

            {/* ✅ AFFICHER LE CONTEXTE SI IL EXISTE */}
            {argumentaire.context && argumentaire.context.trim() && (
              <div className={styles.thesisContext}>
                <h4>Contexte :</h4>
                <p>{argumentaire.context}</p>
              </div>
            )}
            <div className={styles.editButtonContainer}>
              <button className={styles.editButton}>Modifier</button>
            </div>
          </div>

          {/* Onglets Arguments/Références/Définitions */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "arguments" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("arguments")}
              >
                Arguments (0)
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "references" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("references")}
              >
                Références (0)
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "definitions" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("definitions")}
              >
                Définitions (0)
              </button>
            </div>
          </div>
          {/* Contenu des onglets */}
          {activeTab === "arguments" && (
            <div>
              <div className={styles.argumentsHeader}>
                <h3>Arguments</h3>
                <button
                  onClick={() => handleAddArgumentClick("root")}
                  className={styles.addArgumentButton}
                >
                  Ajouter un argument
                </button>
              </div>
              <ArgumentTree
                tree={argumentTree}
                onAddArgument={handleAddArgumentClick}
                onEditArgument={handleEditArgumentClick}
                onDeleteArgument={onDeleteArgument}
              />
            </div>
          )}
          {activeTab === "references" && <div>Contenu Références</div>}
          {activeTab === "definitions" && <div>Contenu Définitions</div>}
        </div>
        {/* Affichage des données */}
        {!showEditForm ? (
          <>
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

            <button onClick={onImportInit}>Ouvrir un argumentaire</button>
            {/* 
            Ne pas jeter tant que StartScreen et les menus ne fonctionnent pas correctement.
            <button onClick={onExport}>Exporter</button>
            <button onClick={onNewArgumentaire}>Nouvel argumentaire</button>
            */}
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
      </main>
    </div>
  );
}
