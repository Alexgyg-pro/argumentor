// src/components/screens/DisplayScreen.jsx
import { ThesisInput } from "../ThesisInput";
//import { ArgumentList } from "../ArgumentList";
import { ArgumentTree } from "../ArgumentTree";
import { useState } from "react";

export function DisplayScreen({
  thesis,
  onThesisChange,
  argumentTree, // ← Maintenant ça a du sens !
  onAddArgument,
  onExport,
  onNewArgumentaire,
  onImportInit,
}) {
  if (!argumentTree) {
    return <div>Chargement de l'arbre...</div>;
  }

  const [selectedParent, setSelectedParent] = useState("root");
  console.log("🔄 DisplayScreen rendu - argumentTree:", argumentTree);
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
          console.log("🖱️ CLIC DÉTECTÉ"); // ← Ce log apparaît-il ?
          console.log("onAddArgument existe?", typeof onAddArgument); // ← Fonction définie ?          console.log("🖱️ Bouton cliqué - parentId:", selectedParent);
          onAddArgument(selectedParent, { claim: "Nouvel argument" });
        }}
      >
        Ajouter un argument
      </button>
      <ArgumentTree
        tree={argumentTree}
        onSelectParent={setSelectedParent}
        onAddArgument={onAddArgument}
      />

      <button onClick={onExport}>Exporter</button>
      <button onClick={onNewArgumentaire}>Nouvel argumentaire</button>
      <button onClick={onImportInit}>Ouvrir un argumentaire</button>
    </div>
  );
}
