// src/components/screens/DisplayScreen.jsx
import { ThesisInput } from "../ThesisInput";
import { ArgumentTree } from "../ArgumentTree";
import { useState } from "react";

export function DisplayScreen({
  onNewArgumentaire,
  thesis,
  onThesisChange,
  argumentTree,
  onExport,
  onImportInit,
  onAddArgument,
  onDeleteArgument,
}) {
  if (!argumentTree) {
    return <div>Chargement de l'arbre...</div>;
  }

  const [selectedParent, setSelectedParent] = useState("root");

  return (
    <div className="display-screen">
      <h1>Mon Argumentaire</h1>

      {/* La thèse */}
      <input
        value={thesis}
        onChange={(e) => onThesisChange(e.target.value)}
        placeholder="Votre thèse principale..."
      />
      <p>Thèse actuelle : {thesis}</p>

      {/* Les arguments ! */}
      <button
        onClick={() => {
          onAddArgument(selectedParent, { claim: "Nouvel argument" });
        }}
      >
        Ajouter un argument
      </button>
      <ArgumentTree
        tree={argumentTree}
        onSelectParent={setSelectedParent}
        onAddArgument={onAddArgument}
        onDeleteArgument={onDeleteArgument}
      />

      <button onClick={onExport}>Exporter</button>
      <button onClick={onNewArgumentaire}>Nouvel argumentaire</button>
      <button onClick={onImportInit}>Ouvrir un argumentaire</button>
    </div>
  );
}
