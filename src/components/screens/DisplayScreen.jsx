// src/components/screens/DisplayScreen.jsx
import { ArgumentTree } from "../ArgumentTree";
import { ArgumentaireModal } from "../modals/ArgumentaireModal";
import { HiddenFileInput } from "../common/HiddenFileInput";
import { useState } from "react";
import styles from "./DisplayScreen.module.css";
import { DefinitionsList } from "../definitions/DefinitionsList";
import { ReferencesList } from "../references/ReferencesList";

export function DisplayScreen({
  argumentaire,
  thesis,
  context,
  forma,
  onUpdateArgumentaire,
  onEdit,

  // Props pour l'import
  fileInputRef,
  onFileSelect,

  // Props pour les arguments
  argumentTree,
  onAddArgument,
  onEditArgument,
  onDeleteArgument,

  // Props pour les définitions
  definitions = [],
  onAddDefinition,
  onUpdateDefinition,
  onDeleteDefinition,

  // Props pour les références
  references = [],
  onAddReference,
  onUpdateReference,
  onDeleteReference,
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("arguments");
  // const [showDefinitionForm, setShowDefinitionForm] = useState(null);

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

  // // ARGUMENT HANDLERS
  // const handleArgumentSave = (argumentData) => {
  //   if (editingArgument) {
  //     // Mode modification - CORRECT
  //     onEditArgument(editingArgument.id, argumentData);
  //   } else {
  //     // Mode création
  //     onAddArgument(selectedParentId, argumentData);
  //   }
  //   setShowArgumentForm(false);
  //   setEditingArgument(null);
  // };

  // const handleArgumentCancel = () => {
  //   setShowArgumentForm(false);
  // };

  // const handleAddArgumentClick = (parentId = "root") => {
  //   setSelectedParentId(parentId);
  //   setEditingArgument(null);
  //   setShowArgumentForm(true);
  // };

  // const handleEditArgumentClick = (argument) => {
  //   setEditingArgument(argument); // Stocker l'argument à modifier
  //   setShowArgumentForm(true);
  // };

  // DEFINITIONS HANDLERS (à implémenter plus tard)
  // const handleNewDefinitionClick = (definitionData) => {
  // setShowDefinitionForm(true);
  // if (editingDefinition) {
  //   // Mode modification - CORRECT
  //   onEditDefinition(editingDefinition.id, definitionData);
  // } else {
  //   // Mode création
  //   onAddDefinition(definitionData);
  // }
  // setShowArgumentForm(false);
  // setEditingArgument(null);
  // };

  // REFERENCES HANDLERS (à implémenter plus tard)

  // Compteurs pour les onglets
  const argumentsCount = argumentTree.children?.length || 0;
  const definitionsCount = definitions.length;
  const referencesCount = references.length;

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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.();
                }}
                className={styles.editButton}
              >
                Modifier
              </button>
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
                Arguments ({argumentsCount})
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "references" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("references")}
              >
                Références ({referencesCount} )
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "definitions" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("definitions")}
              >
                Définitions ({definitionsCount})
              </button>
            </div>
          </div>
          {/* Contenu des onglets */}

          {/* Onglet Arguments */}
          {activeTab === "arguments" && (
            <ArgumentTree
              tree={argumentTree}
              onAddArgument={onAddArgument}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              references={references}
            />
          )}

          {/* Onglet Références */}
          {activeTab === "references" && (
            <ReferencesList
              references={references}
              onAddReference={onAddReference}
              onUpdateReference={onUpdateReference}
              onDeleteReference={onDeleteReference}
            />
          )}

          {/* Onglet Définitions */}
          {activeTab === "definitions" && (
            <DefinitionsList
              definitions={definitions}
              onAddDefinition={onAddDefinition}
              onUpdateDefinition={onUpdateDefinition}
              onDeleteDefinition={onDeleteDefinition}
            />
          )}
        </div>
        {/* Modale pour modifier l'argumentaire */}
        {!showEditForm && (
          <ArgumentaireModal
            isOpen={showEditForm}
            onClose={handleEditCancel}
            onSave={handleEditSave}
            initialData={{ thesis, context, forma }}
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
