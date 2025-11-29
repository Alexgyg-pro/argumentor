// src/hooks/useArgumentaire.js
import { useState, useRef } from "react";
import { confirmIfDirty } from "../utils/confirm";

export function useArgumentaire() {
  const [thesis, setThesis] = useState("");
  const [context, setContext] = useState("");
  const [forma, setForma] = useState("Descriptif");
  const [currentMode, setCurrentMode] = useState("start");
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  // Pour l'arbre des arguments
  const [argumentTree, setArgumentTree] = useState(null);

  // MODIFICATION DE L'ENSEMBLE DE L'ARGUMENTAIRE
  /**
   * Initialise un nouvel argumentaire vide
   */
  const handleNewArgumentaire = (formData = {}) => {
    setThesis(formData.thesis || "");
    setContext(formData.context || "");
    setForma(formData.forma || "Descriptif");
    setArgumentTree({
      id: "root",
      claim: formData.thesis || "",
      children: [],
    });
    setCurrentMode("display");
    setIsDirty(false);
  };

  /**
   * Met à jour l'argumentaire complet
   */
  const handleUpdateArgumentaire = (formData) => {
    setThesis(formData.thesis);
    setContext(formData.context);
    setForma(formData.forma);
    setIsDirty(true);
  };

  /**
   * Met à jour la thèse principale (à supprimer, puisqu'il y a handleUpdateArgumentaire ?)
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
    console.log("handleImportInit called");
    if (!confirmIfDirty(isDirty)) return;
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
      context,
      forma,
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

    // Actions principales
    handleNewArgumentaire,
    handleUpdateArgumentaire,
    handleThesisChange,

    // Import/Export
    handleImportInit,
    handleFileSelect,
    handleExport,
    fileInputRef,

    // Arguments
    handleAddArgument,
    handleEditArgument,
    handleDeleteArgument,
  };
}
