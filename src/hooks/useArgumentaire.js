// src/hooks/useArgumentaire.js
import { useState, useRef } from "react";

export function useArgumentaire() {
  const [thesis, setThesis] = useState("");
  const [currentMode, setCurrentMode] = useState("start");
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  // Pour l'arbre des arguments
  const [argumentTree, setArgumentTree] = useState(null);

  // MODIFICATION DE L'ENSEMBLE DE L'ARGUMENTAIRE
  /**
   * Initialise un nouvel argumentaire vide
   */
  const handleNewArgumentaire = () => {
    setThesis("");
    setArgumentTree({
      id: "root",
      claim: "",
      children: [],
    });
    setCurrentMode("display");
    setIsDirty(false);
  };

  /**
   * Met à jour la thèse principale
   * @param {string} newValue
   */
  const handleThesisChange = (newValue) => {
    setThesis(newValue);
    setIsDirty(true);
  };

  // IMPORT/EXPORT - Tout intégré ici
  /**
   * Initialise le processus d'import en déclenchant la sélection de fichier
   */
  const handleImportInit = () => {
    fileInputRef.current?.click();
  };

  /**
   * Gère la sélection d'un fichier pour l'import
   * @param {*} event
   * @returns
   */
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        // Met à jour l'état avec les données importées
        setThesis(jsonData.thesis || "");
        setArgumentTree(
          jsonData.tree ||
            jsonData.argumentTree || {
              id: "root",
              claim: jsonData.thesis || "",
              children: jsonData.arguments || [],
            }
        );

        setCurrentMode("display");
        setIsDirty(false);
      } catch (error) {
        alert(`Erreur d'import : ${error.message}`);
      }
      // Reset pour pouvoir re-sélectionner le même fichier
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  /**
   * Exporte l'argumentaire actuel en fichier JSON
   */
  const handleExport = () => {
    const data = {
      thesis,
      tree: argumentTree,
      version: "1.0",
      exportedAt: new Date().toISOString(),
    };

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
  };

  // GESTION DES ARGUMENTS
  /**
   * Ajoute un nouvel argument à l'arbre des arguments
   * @param {string} parentId - ID de l'argument parent
   * @param {object} argumentData - Données de l'argument à ajouter
   */
  const handleAddArgument = (parentId, argumentData) => {
    const newArgument = {
      id: Date.now(), // Solution simple pour un ID unique
      claim: "Argument exemple " + (argumentTree.children.length + 1),
    };
    setArgumentTree({
      ...argumentTree,
      children: [...argumentTree.children, newArgument],
    });

    setIsDirty(true);
  };

  return {
    // État
    thesis,
    currentMode,
    setCurrentMode,
    isDirty,
    argumentTree,

    // Actions principales
    handleNewArgumentaire,
    handleThesisChange,

    // Import/Export
    handleImportInit,
    handleFileSelect,
    handleExport,
    fileInputRef,

    // Arguments
    handleAddArgument,
  };
}
