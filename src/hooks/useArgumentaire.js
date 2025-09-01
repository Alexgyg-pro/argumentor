import { useState, useRef } from "react";

export function useArgumentaire() {
  // Tous les states et fonctions de App.jsx vont venir ici
  const [currentMode, setCurrentMode] = useState("choice");
  const [isDirty, setIsDirty] = useState(false);
  const [proposition, setProposition] = useState("");
  const [argumentList, setArgumentList] = useState([]);
  const fileInputRef = useRef(null);

  // Déplace toutes tes fonctions ici (handleNew, handleImportInit, etc.)
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
  // ... déplace toutes les autres fonctions

  // Return tout ce dont les composants auront besoin
  return {
    currentMode,
    isDirty,
    proposition,
    argumentList,
    fileInputRef,
    handleNew,
    handleImportInit,
    handleImportSuccess,
    handleNavigateAway,
    handleExport,
    handlePropositionChange,
    handleAddArgument,
  };
}
