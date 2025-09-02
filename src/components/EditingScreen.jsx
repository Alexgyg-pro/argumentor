import { PropositionInput } from "./PropositionInput";
import { ArgumentList } from "./ArgumentList";
import { ExportButton } from "./ExportButton";

export function EditingScreen({
  proposition,
  argumentList,
  isDirty,
  handleNavigateAway,
  handleNew,
  handleImportInit,
  handleExport,
  handlePropositionChange,
  handleAddArgument,
  onEditArgument,
  onDeleteArgument,
}) {
  return (
    <div className="editing-screen">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={() => handleNavigateAway(handleNew)}>
          ➕ Nouveau
        </button>
        <button onClick={() => handleNavigateAway(handleImportInit)}>
          📂 Ouvrir
        </button>
        {isDirty && <button onClick={handleExport}>💾 Exporter</button>}
      </div>

      <PropositionInput
        value={proposition}
        onValueChange={handlePropositionChange}
      />

      <button onClick={handleAddArgument} disabled={proposition.trim() === ""}>
        Ajouter un argument
      </button>

      <ArgumentList
        argumentList={argumentList}
        onEditArgument={onEditArgument}
        onDeleteArgument={onDeleteArgument}
      />
    </div>
  );
}
