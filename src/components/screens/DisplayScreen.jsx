// src/components/screens/DisplayScreen.jsx
import { ArgumentTree } from "../arguments/ArgumentTree";
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
  argumentsCount,
  neutralArgumentsCount,
  onMoveArgument,
  onGetPossibleParents,
  getArgumentCode,
  getArgumentColor,

  // Props pour les définitions
  definitions = [],
  onAddDefinition,
  onUpdateDefinition,
  onDeleteDefinition,
  definitionsCount,

  // Props pour les références
  references = [],
  onAddReference,
  onUpdateReference,
  onDeleteReference,
  referencesCount,
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

            <div className={styles.editArgumentaireButtonContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.();
                }}
                className={styles.editArgumentaireButton}
              >
                Modifier
              </button>
            </div>
          </div>

          {/* Bandeau d'alerte pour arguments neutres */}
          {neutralArgumentsCount > 0 && (
            <div className={styles.neutralAlert}>
              <div className={styles.alertContent}>
                ⚠️{" "}
                <strong>{neutralArgumentsCount} argument(s) neutre(s)</strong> -
                Veuillez les positionner en "Pour" ou "Contre" avant de
                finaliser l'argumentaire.
              </div>
            </div>
          )}

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
              onGetPossibleParents={onGetPossibleParents}
              onMoveArgument={onMoveArgument}
              getArgumentCode={getArgumentCode}
              getArgumentColor={getArgumentColor}
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
