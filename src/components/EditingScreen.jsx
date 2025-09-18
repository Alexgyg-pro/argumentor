import { ThesisEditor } from "./ThesisEditor";
import { ArgumentList } from "./ArgumentList";
import { ExportButton } from "./ExportButton";
import { calculateGlobalScore as calcGlobalScore } from "../utils/calculations";

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
}) {
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

  return (
    <div className="editing-screen">
      <div className="global-score">
        <h3>Score global: {score.toFixed(2)}</h3>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={() => handleNavigateAway(handleNew)}>
          ➕ Nouveau
        </button>
        <button onClick={() => handleNavigateAway(handleImportInit)}>
          📂 Ouvrir
        </button>
        {isDirty && <button onClick={handleExport}>💾 Exporter</button>}
      </div>

      <ThesisEditor
        thesis={thesis}
        onThesisChange={handleThesisChange}
        onCancel={handleCancelThesis}
        isNewThesis={isNewThesis}
      />

      <button onClick={handleAddArgument} disabled={thesis.text.trim() === ""}>
        Ajouter un argument
      </button>

      {needsRecalculation && (
        <button onClick={recalculateScores}>🔄 Recalculer les scores</button>
      )}

      <ArgumentList
        argumentList={argumentList}
        onEditArgument={onEditArgument}
        onDeleteArgument={onDeleteArgument}
        onAddChildArgument={handleAddChildArgument}
        getAllNodesExceptSubtree={getAllNodesExceptSubtree}
        handleMoveArgument={handleMoveArgument}
        argumentTree={argumentTree}
        getArgumentCode={getArgumentCode}
        thesis={thesis || {}}
      />
    </div>
  );
}
