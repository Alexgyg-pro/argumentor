import { useState, useRef } from "react";

export function useArgumentaire() {
  // États principaux
  const [currentMode, setCurrentMode] = useState("choice");
  const [isDirty, setIsDirty] = useState(false);
  const [proposition, setProposition] = useState("");
  const [argumentTree, setArgumentTree] = useState({
    id: "root",
    text: "La Terre est ronde",
    causa: null,
    children: [],
  });

  // Référence pour l'input fichier caché
  const fileInputRef = useRef(null);

  // La liste d'arguments est désormais DÉRIVÉE de l'arbre
  const argumentList = argumentTree.children || [];

  // Fonction pour trouver un nœud par son ID (récursif)
  const findNodeById = (node, targetId) => {
    if (node.id === targetId) return node;
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
    return null;
  };

  // Fonction récursive pour supprimer un nœud
  const deleteNodeRecursively = (node, targetId) => {
    if (node.id === targetId) {
      return null;
    }

    const newChildren = node.children
      .map((child) => deleteNodeRecursively(child, targetId))
      .filter((child) => child !== null);

    return {
      ...node,
      children: newChildren,
    };
  };

  // GESTIONNAIRES D'ÉVÉNEMENTS

  const handleNew = () => {
    setProposition("");
    setArgumentTree({
      id: "root",
      text: "",
      causa: null,
      children: [],
    });
    setIsDirty(false);
    setCurrentMode("editing");
  };

  const handleImportInit = () => {
    fileInputRef.current?.click();
  };

  // Gestionnaire de changement de fichier (NOUVEAU - centralisé ici)
  const handleFileChange = (e) => {
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

  const handlePropositionChange = (newValue) => {
    setProposition(newValue);
    setIsDirty(true);
  };

  const handleAddArgument = () => {
    const newArgument = {
      id: Date.now(),
      text: "Nouvel argument",
      causa: "pro",
      parentId: "root",
      children: [],
    };
    addChildToNode("root", newArgument);
    setIsDirty(true);
  };

  // Fonction pour ajouter un enfant à un nœud
  const addChildToNode = (parentId, newChild) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const parent = findNodeById(newTree, parentId);
      if (parent) {
        parent.children.push(newChild);
      }
      return newTree;
    });
  };

  const onEditArgument = (id, newText) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToEdit = findNodeById(newTree, id);
      if (nodeToEdit) {
        nodeToEdit.text = newText;
      }
      return newTree;
    });
    setIsDirty(true);
  };

  const onDeleteArgument = (id) => {
    const nodeToDelete = findNodeById(argumentTree, id);

    if (nodeToDelete && nodeToDelete.children.length > 0) {
      alert(
        "Impossible de supprimer un argument qui a des sous-arguments. Veuillez d'abord supprimer ou déplacer ses sous-arguments."
      );
      return;
    }

    if (window.confirm("Supprimer cet argument ?")) {
      setArgumentTree((prevTree) => {
        return deleteNodeRecursively(prevTree, id);
      });
      setIsDirty(true);
    }
  };

  const handleExport = () => {
    const data = {
      proposition: proposition,
      arguments: argumentTree.children,
      version: "1.0",
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
    setIsDirty(false);
  };

  // IMPORTANT : Normalisation des données importées
  const handleImportSuccess = (jsonData) => {
    // Normalisation des arguments pour s'assurer qu'ils ont tous la structure complète
    const normalizedArguments = (jsonData.arguments || []).map((arg) => ({
      ...arg,
      causa: arg.causa || "pro",
      parentId: arg.parentId || "root",
      children: arg.children || [],
    }));

    const newTree = {
      id: "root",
      text: jsonData.proposition || "",
      causa: null,
      children: normalizedArguments,
    };

    setProposition(jsonData.proposition || "");
    setArgumentTree(newTree);
    setIsDirty(false);
    setCurrentMode("editing");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // On expose uniquement ce qui est nécessaire aux composants
  return {
    argumentList,
    currentMode,
    isDirty,
    proposition,
    argumentTree,
    fileInputRef,
    handleNew,
    handleImportInit,
    handleFileChange, // NOUVEAU - exporté pour App.jsx
    handleNavigateAway,
    handleExport,
    handlePropositionChange,
    handleAddArgument,
    onEditArgument,
    onDeleteArgument,
    handleImportSuccess,
  };
}
