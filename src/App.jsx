// import { useState } from "react";
import { useState, useRef } from "react"; // <-- Ajoute useRef
import { PropositionInput } from "./components/PropositionInput";
import { ArgumentList } from "./components/ArgumentList";
import { ExportButton } from "./components/ExportButton";
import { ImportButton } from "./components/ImportButton";
import "./App.css";

function App() {
  // États de gestion d'application
  const [currentMode, setCurrentMode] = useState("choice"); // 'choice' ou 'editing'
  const [isDirty, setIsDirty] = useState(false);

  // États des données
  const [proposition, setProposition] = useState("");
  const [argumentList, setArgumentList] = useState([]);

  const fileInputRef = useRef(null); // <-- Crée la référence

  const handleNew = () => {
    setProposition("");
    setArgumentList([]);
    setIsDirty(false);
    setCurrentMode("editing");
  };

  const handleImportInit = () => {
    console.log(
      "1. Click sur Ouvrir - ref value avant:",
      fileInputRef.current?.value
    );
    fileInputRef.current?.click();
    console.log(
      "2. Click déclenché - ref value après:",
      fileInputRef.current?.value
    );
  };

  const handleImportSuccess = (jsonData) => {
    console.log("3. Import réussi - reset va s'executer");
    if (jsonData.proposition !== undefined) {
      setProposition(jsonData.proposition);
    }
    setArgumentList(jsonData.arguments || []);
    setIsDirty(false);
    setCurrentMode("editing");

    // RÉINITIALISATION ÉLÉGANTE
    if (fileInputRef.current) {
      console.log("4. Ref value avant reset:", fileInputRef.current.value);
      fileInputRef.current.value = "";
      console.log("5. Ref value après reset:", fileInputRef.current.value);
    }

    // RÉINITIALISATION CRUCIALE DE L'INPUT FILE
    // Ceci est une solution moins élégante au fait que input file ne peut avoir qu'une
    // const fileInput = document.getElementById("hidden-file-input");
    // if (fileInput) {
    //   fileInput.value = ""; // Cette ligne reset la sélection
    // }
  };

  const handleNavigateAway = (action) => {
    if (!isDirty) {
      action();
      return;
    }

    if (window.confirm("Sauvegarder avant de quitter ?")) {
      handleExport();
      action();
    } else {
      action();
    }
    setIsDirty(false);
  };

  // MODIFIE ta fonction handlePropositionChange :
  const handlePropositionChange = (newValue) => {
    setProposition(newValue);
    setIsDirty(true); // <-- Marque comme modifié
  };

  // MODIFIE handleAddArgument :
  const handleAddArgument = () => {
    const newArgument = {
      id: Date.now(),
      text: "Argument exemple " + (argumentList.length + 1),
    };
    setArgumentList([...argumentList, newArgument]);
    setIsDirty(true); // <-- Marque comme modifié
  };

  const handleImport = (jsonData) => {
    if (jsonData.proposition !== undefined) {
      setProposition(jsonData.proposition); // Pre-remplit le champ
    }
    // Plus tard, tu géreras aussi setArgumentList ici
  };

  // const handleNew = () => {
  //   setProposition("");
  //   setArgumentList([]);
  //   setIsDirty(false);
  // };

  const handleImportWrapper = (jsonData) => {
    // ... ta logique d'import existante
    setIsDirty(false); // L'importé est considéré comme "propre"
  };

  const handleExport = () => {
    // 1. Créer l'objet de données complet (pour plus tard)
    const data = {
      proposition: proposition,
      arguments: argumentList, // On ajoute déjà la structure pour les arguments
      version: "1.0",
    };

    // 2. Logique d'export (existe déjà dans ExportButton, on la centralise ici)
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "argumentaire.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 3. APRÈS avoir exporté, on reset le flag "sale"
    setIsDirty(false);
  };

  const confirmNavigation = (actionCallback) => {
    if (!isDirty) {
      actionCallback(); // Exécute l'action directement si rien n'est modifié
      return;
    }

    if (
      window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous sauvegarder avant de continuer ?"
      )
    ) {
      // Ici, tu pourrais déclencher un export automatique puis faire l'action
      handleExport(); // Tu devras créer cette fonction qui exporte et reset isDirty
      actionCallback();
    } else {
      actionCallback(); // Ou exécute l'action sans sauvegarder
    }
    setIsDirty(false); // Reset l'état après l'action
  };

  const handleNewArgumentaire = () => {
    setProposition("");
    setArgumentList([]);
    setIsDirty(false);
  };

  // const handleImportSuccess = (jsonData) => {
  //   if (jsonData.proposition !== undefined) {
  //     setProposition(jsonData.proposition);
  //   }
  //   // Plus tard: setArgumentList(jsonData.arguments || []);
  //   setIsDirty(false);
  // };

  return (
    <div className="app">
      <h1>Argumentor</h1>

      <input
        type="file"
        ref={fileInputRef} // <-- Remplace id par ref
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              handleNavigateAway(() => handleImportSuccess(jsonData));
            } catch (error) {
              alert("Fichier JSON invalide");
            }
          };
          reader.readAsText(file);
        }}
      />

      {currentMode === "choice" ? (
        /* --- ÉCRAN DE CHOIX --- */
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={handleNew}>➕ Nouvel argumentaire</button>
          <button onClick={handleImportInit}>📂 Ouvrir un argumentaire</button>
          {/* Input caché pour l'import */}
        </div>
      ) : (
        /* --- ÉCRAN D'ÉDITION --- */
        <>
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

          <button
            onClick={handleAddArgument}
            disabled={proposition.trim() === ""}
          >
            Ajouter un argument
          </button>

          <ArgumentList argumentList={argumentList} />
        </>
      )}
    </div>
  );
}

export default App;
