// src/hooks/useArgumentaire.js
import { useState, useRef, useEffect } from "react";
import { confirmIfDirty } from "../utils/confirm";
import { useArguments } from "./useArguments";

export function useArgumentaire() {
  const [thesis, setThesis] = useState("");
  const [context, setContext] = useState("");
  const [forma, setForma] = useState("Descriptif");
  const [currentMode, setCurrentMode] = useState("start");
  const [isDirty, setIsDirty] = useState(false);
  const [shouldAutoShowForm, setShouldAutoShowForm] = useState(false);
  const [editingArgumentaire, setEditingArgumentaire] = useState(false);
  const fileInputRef = useRef(null);
  const {
    argumentTree,
    addArgument,
    updateArgument,
    deleteArgument,
    moveArgument,
    importArguments,
    resetArguments,
    setArguments,
  } = useArguments();

  // Pour l'arbre des arguments
  // const [argumentTree, setArgumentTree] = useState(null);

  useEffect(() => {
    console.log("🔄 editingArgumentaire a changé:", editingArgumentaire);
  }, [editingArgumentaire]);

  // MODIFICATION DE L'ENSEMBLE DE L'ARGUMENTAIRE

  const handleNewArgumentaire = (formData = {}, forceShowForm = false) => {
    console.log(
      "🎯 handleNewArgumentaire appelé, forceShowForm:",
      forceShowForm
    );

    setThesis(formData.thesis || "");
    setContext(formData.context || "");
    setForma(formData.forma || "Descriptif");
    setArguments(null);

    const hasData = formData.thesis || formData.context || formData.forma;
    setIsDirty(!!hasData);

    console.log("📝 Avant setCurrentMode, forceShowForm:", forceShowForm);

    if (forceShowForm) {
      console.log("🚀 Set mode: start-with-form");
      setCurrentMode("start-with-form");
    } else {
      console.log("🚀 Set mode: display");
      setCurrentMode("display");
    }
  };

  /**
   * Met à jour l'argumentaire complet
   */
  const handleUpdateArgumentaire = (formData) => {
    console.log("🎯 handleUpdateArgumentaire appelé");
    setThesis(formData.thesis);
    setContext(formData.context);
    setForma(formData.forma);
    setIsDirty(true);
    setEditingArgumentaire(false);
  };

  const handleCancelEdit = () => {
    setEditingArgumentaire(false);
  };

  // IMPORT/EXPORT - Tout intégré ici
  /**
   * Initialise le processus d'import en déclenchant la sélection de fichier
   */
  const handleImportInit = () => {
    // if (!confirmIfDirty(isDirty)) return;
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

  const handleSave = () => {
    console.log("💾 Enregistrement local - à implémenter");
    // Futur: sauvegarde automatique dans le localStorage/navigateur
    setIsDirty(false);
  };

  /**
   * Download l'argumentaire actuel en fichier JSON
   */
  const handleDownload = () => {
    const data = {
      thesis,
      context,
      forma,
      tree: argumentTree,
      version: "1.0",
      downloadedAt: new Date().toISOString(),
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

  const handleExportPdf = () => {
    console.log("📄 Export PDF - à implémenter");
  };

  // GESTION DES ARGUMENTS
  /**
   * Ajoute un nouvel argument à l'arbre des arguments
   * @param {string} parentId - ID de l'argument parent
   * @param {object} argumentData - Données de l'argument à ajouter
   */
  const handleAddArgument = (parentId, argumentData) => {
    const newArgument = {
      id: Date.now().toString(),
      parentId: parentId,
      claim: argumentData.claim,
      claimComment: argumentData.claimComment || "",
      causa: argumentData.causa || "neutralis",
      forma: argumentData.forma || "descriptif",
      natura: argumentData.natura || "validity",
      validity:
        argumentData.validity !== undefined ? argumentData.validity : 0.5,
      relevance:
        argumentData.relevance !== undefined ? argumentData.relevance : 0.5,
      value: argumentData.value !== undefined ? argumentData.value : 0.5,
      weight: argumentData.weight !== undefined ? argumentData.weight : 0.5,
      references: argumentData.references || [],
      children: [],
    };

    // Fonction récursive pour ajouter l'argument au bon parent
    const addToTree = (node) => {
      // Si c'est le parent qu'on cherche, on ajoute directement
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newArgument],
        };
      }

      // Sinon, on cherche dans les enfants
      if (node.children && node.children.length > 0) {
        // Vérifier d'abord si le parent est dans les enfants directs
        const directChildIndex = node.children.findIndex(
          (child) => child.id === parentId
        );
        if (directChildIndex !== -1) {
          // Parent trouvé dans les enfants directs - ajouter et s'arrêter
          const updatedChildren = [...node.children];
          updatedChildren[directChildIndex] = {
            ...updatedChildren[directChildIndex],
            children: [
              ...(updatedChildren[directChildIndex].children || []),
              newArgument,
            ],
          };
          return {
            ...node,
            children: updatedChildren,
          };
        }

        // Si pas trouvé dans les enfants directs, chercher récursivement
        const updatedChildren = node.children.map((child) => addToTree(child));
        return {
          ...node,
          children: updatedChildren,
        };
      }

      return node;
    };

    setArgumentTree(addToTree(argumentTree));
    setIsDirty(true);
  };

  /**
   * Modifie un argument existant
   * @param {string} argumentId - ID de l'argument à modifier
   * @param {object} newData - Nouvelles données de l'argument
   */
  const handleEditArgument = (argumentId, newData) => {
    const updateInTree = (node) => {
      if (node.id === argumentId) {
        return {
          ...node,
          claim: newData.claim,
          claimComment: newData.claimComment,
          causa: newData.causa,
          forma: newData.forma,
          natura: newData.natura,
          validity: newData.validity,
          relevance: newData.relevance,
          value: newData.value,
          weight: newData.weight,
          references: newData.references,
        };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map((child) => updateInTree(child)),
        };
      }

      return node;
    };

    setArgumentTree(updateInTree(argumentTree));
    setIsDirty(true);
  };

  /**
   * Déplace un argument vers un nouveau parent
   */
  const handleMoveArgument = (argumentId, newParentId) => {
    // Validation : éviter les cycles (argument → ses propres descendants)
    // Modification du parentId + restructuration de l'arbre
    // + facile avec parentId explicite !
  };

  /**
   * Supprime un argument après confirmation
   * @param {string} argumentId - ID de l'argument à supprimer
   */
  const handleDeleteArgument = (argumentId) => {
    // Vérifier si l'argument a des enfants
    const argument = findArgumentById(argumentTree, argumentId);
    if (argument && argument.children && argument.children.length > 0) {
      alert(
        "Impossible de supprimer cet argument car il contient des sous-arguments."
      );
      return;
    }

    // Demander confirmation
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet argument ?")) {
      return;
    }

    // Supprimer l'argument
    const deleteFromTree = (node) => {
      if (node.children) {
        return {
          ...node,
          children: node.children.filter((child) => child.id !== argumentId),
        };
      }
      return node;
    };

    setArgumentTree(deleteFromTree(argumentTree));
    setIsDirty(true);
  };

  // FONCTIONS UTILITAIRES
  // Fonction utilitaire pour trouver un argument par ID
  const findArgumentById = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const found = findArgumentById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  return {
    // État
    thesis,
    context,
    forma,
    currentMode,
    setCurrentMode,
    isDirty,
    argumentTree,

    // Actions sur l'argumentaire
    handleNewArgumentaire,
    handleUpdateArgumentaire,
    editingArgumentaire,
    setEditingArgumentaire,
    handleCancelEdit,
    // handleThesisChange,

    // Import
    handleImportInit,
    handleFileSelect,
    // handleExport,
    fileInputRef,

    // Téléchargement
    handleDownload,
    handleSave,
    handleExportPdf,

    // Arguments
    argumentTree,
    handleAddArgument: addArgument,
    handleEditArgument: updateArgument,
    handleDeleteArgument: deleteArgument,
    handleMoveArgument: moveArgument,
    importArgumentTree: importArguments,
    resetArgumentTree: resetArguments,
    setArgumentTree: setArguments,
  };
}
