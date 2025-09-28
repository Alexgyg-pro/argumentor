// src/components/EditingScreen.jsx
import { useState, useEffect } from "react";
import { ThesisDisplay } from "./thesis/ThesisDisplay";
import { ThesisEditor } from "./thesis/ThesisEditor";
import { ArgumentCard } from "./argument/ArgumentCard";
import { ExportButton } from "./ExportButton";
import { ReferencesManager } from "../components/reference/ReferencesManager";
import styles from "./EditingScreen.module.css";

export function EditingScreen({
  thesis,
  isNewThesis = false,
  argumentList,
  handleThesisChange,
  handleAddArgument,
  onEditArgument,
  onDeleteArgument,
  handleAddChildArgument,
  handleMoveArgument,
  getArgumentCode,
  handleExport,
  references,
  addReference,
  updateReference,
  deleteReference,
  getAllNodesExceptSubtree,
  argumentTree,
}) {
  const [activeTab, setActiveTab] = useState("arguments");
  const [isEditingThesis, setIsEditingThesis] = useState(false);

  // Ouvre automatiquement l'éditeur si nouvel argumentaire
  useEffect(() => {
    if (isNewThesis) {
      setIsEditingThesis(false);
    }
  }, [isNewThesis]);

  return (
    <div className={styles.editingContainer}>
      <main className="flex-1 flex justify-center items-start p-5">
        <div className="bg-white min-w-65p p-5 rounded-lg shadow-md">
          {/* Affichage/Édition de la thèse */}
          {/* {isEditingThesis ? (
            <ThesisEditor
              thesis={thesis}
              onSave={(newThesis) => {
                handleThesisChange(newThesis);
                setIsEditingThesis(false);
              }}
              onCancel={() => setIsEditingThesis(false)}
            />
          ) : (
            <ThesisDisplay
              thesis={thesis}
              onEdit={() => setIsEditingThesis(true)}
            />
          )} */}

          <div className={styles.thesisCard}>
            <div className={styles.thesisHeader}>
              <h2 className={styles.thesisTitle}>{thesis.text}</h2>
              <span className={styles.thesisType}>{thesis.forma}</span>
            </div>
            <div className={styles.thesisActions}>
              <button
                onClick={() => setIsEditingThesis(true)}
                className={styles.editButton}
              >
                ✏️ Modifier la thèse
              </button>
            </div>
          </div>

          {/* Onglets Arguments/Références */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "arguments" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("arguments")}
            >
              Arguments ({argumentList.length})
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "references" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("references")}
            >
              Références ({references.length})
            </button>
          </div>

          {/* Contenu des onglets */}
          {activeTab === "arguments" && (
            <div className={styles.argumentsSection}>
              <button
                onClick={handleAddArgument}
                className={styles.addArgumentButton}
              >
                + Ajouter un argument
              </button>

              <ul>
                {argumentList.map((argument) => (
                  <ArgumentCard
                    key={argument.id}
                    argument={argument}
                    getArgumentCode={getArgumentCode}
                    // CORRECTION DES PROPS :
                    onEditArgument={onEditArgument} // ← "onEdit" → "onEditArgument"
                    onDeleteArgument={onDeleteArgument} // ← "onDelete" → "onDeleteArgument"
                    onAddChildArgument={handleAddChildArgument} // ← "onAddChild" → "onAddChildArgument"
                    handleMoveArgument={handleMoveArgument} // ← "onMove" → "handleMoveArgument"
                    // AJOUT DES PROPS MANQUANTES :
                    getAllNodesExceptSubtree={getAllNodesExceptSubtree}
                    argumentTree={argumentTree}
                    thesis={thesis}
                    references={references}
                    depth={0} // ou la profondeur appropriée
                  />
                ))}
              </ul>
            </div>
          )}

          {activeTab === "references" && (
            <ReferencesManager
              references={references}
              onAddReference={addReference}
              onUpdateReference={updateReference}
              onDeleteReference={deleteReference}
            />
          )}

          <div className="mt-6">
            <ExportButton onExport={handleExport} thesis={thesis} />
          </div>
        </div>
      </main>
    </div>
  );
}
