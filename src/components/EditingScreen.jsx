// src/components/EditingScreen.jsx
import { useState, useEffect } from "react";
import { ThesisDisplay } from "./thesis/ThesisDisplay";
import { ThesisEditor } from "./thesis/ThesisEditor";
import { ArgumentCard } from "./argument/ArgumentCard";
import { ExportButton } from "./ExportButton";
import { ReferencesManager } from "./ReferencesManager";

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
    <div className="min-h-screen bg-beige flex flex-col">
      <main className="flex-1 flex justify-center items-start p-5">
        <div className="bg-white min-w-65p p-5 rounded-lg shadow-md">
          {/* Affichage/Édition de la thèse */}
          {isEditingThesis ? (
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
          )}

          {/* Onglets Arguments/Références */}
          <div className="tabs flex border-b mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "arguments"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("arguments")}
            >
              Arguments ({argumentList.length})
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "references"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("references")}
            >
              Références ({references.length})
            </button>
          </div>

          {/* Contenu des onglets */}
          {activeTab === "arguments" && (
            <div>
              <button
                onClick={handleAddArgument}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Ajouter un argument
              </button>

              <ul>
                {argumentList.map((argument) => (
                  <ArgumentCard
                    key={argument.id}
                    argument={argument}
                    getArgumentCode={getArgumentCode}
                    onEdit={onEditArgument}
                    onDelete={onDeleteArgument}
                    onAddChild={handleAddChildArgument}
                    onMove={handleMoveArgument}
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
