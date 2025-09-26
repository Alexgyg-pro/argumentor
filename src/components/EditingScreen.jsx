import { useCallback, useState } from "react";
import { ThesisEditor } from "./ThesisEditor";
import { ArgumentList } from "./ArgumentList";
import { ExportButton } from "./ExportButton";
import { calculateGlobalScore as calcGlobalScore } from "../utils/calculations";
import { ReferencesManager } from "./ReferencesManager";

export function EditingScreen({
  // proposition,
  thesis,
  argumentList,
  isDirty,
  setArgumentTree,
  handleNavigateAway,
  handleNew,
  handleImportInit,
  handleExport,
  // handlePropositionChange,
  handleThesisChange,
  handleAddArgument,
  onEditArgument,
  onDeleteArgument,
  handleAddChildArgument,
  getAllNodesExceptSubtree, // <-- Ajoute cette ligne
  handleMoveArgument, // <-- Ajoute cette ligne
  argumentTree, // <-- Ajoute cette ligne (crucial !)
  getArgumentCode,
  calculateGlobalScore,
  isNewThesis,
  setIsNewThesis,
  setCurrentMode,
  needsRecalculation, // ← AJOUTER
  recalculateScores, // ← AJOUTER
  references,
  addReference,
  updateReference,
  deleteReference,
}) {
  // const hasNeutralArguments = useCallback(() => {
  //   const checkNeutral = (node) => {
  //     if (node.causa === "neutralis") return true;
  //     return node.children?.some(checkNeutral) || false;
  //   };
  //   return argumentTree.children?.some(checkNeutral) || false;
  // }, [argumentTree]);
  const [activeTab, setActiveTab] = useState("arguments");
  const score = calcGlobalScore(argumentTree, thesis.forma);

  const handleCancelThesis = () => {
    console.log("🔄 handleCancelThesis appelé");
    console.log("isNewThesis:", isNewThesis);
    if (isNewThesis) {
      console.log("📤 Retour à l'écran de choix");
      setIsNewThesis(false);
      setCurrentMode("choice");
    } else {
      console.log("📝 Annulation simple");
      // Rien à faire - ThesisEditor gère ça
    }
  };

  // Ajouter cette fonction
  const hasNeutralArguments = useCallback(() => {
    const checkNeutral = (node) => {
      if (node.causa === "neutralis") return true;
      return node.children?.some(checkNeutral) || false;
    };
    return argumentTree.children?.some(checkNeutral) || false;
  }, [argumentTree]);

  // Ajouter l'alerte

  return (
    <div className="editing-screen">
      <ThesisEditor
        thesis={thesis}
        onThesisChange={handleThesisChange} // ← CHANGER ICI
        onCancel={handleCancelThesis}
        isNewThesis={isNewThesis}
      />

      {/* BARRE D'ONGLETS */}
      <div className="tabs">
        <button
          className={activeTab === "arguments" ? "active" : ""}
          onClick={() => setActiveTab("arguments")}
        >
          Arguments ({argumentList.length})
        </button>
        <button
          className={activeTab === "references" ? "active" : ""}
          onClick={() => setActiveTab("references")}
        >
          Références ({references.length})
        </button>
      </div>

      {/* CONTENU DES ONGLETS */}
      {activeTab === "arguments" && (
        <div>
          <button onClick={handleAddArgument}>+ Ajouter un argument</button>
          <ArgumentList
            argumentList={argumentList}
            onEditArgument={onEditArgument}
            onDeleteArgument={onDeleteArgument}
            onAddChildArgument={handleAddChildArgument}
            getAllNodesExceptSubtree={getAllNodesExceptSubtree}
            handleMoveArgument={handleMoveArgument}
            argumentTree={argumentTree}
            getArgumentCode={getArgumentCode}
            thesis={thesis}
            references={references}
          />
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

      <ExportButton onExport={handleExport} thesis={thesis} />
    </div>
  );
}
