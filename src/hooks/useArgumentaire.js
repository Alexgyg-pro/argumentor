import { useState, useRef, useEffect } from "react"; // <-- Ajoute useEffect

export function useArgumentaire() {
  // Tous les states et fonctions de App.jsx vont venir ici
  const [currentMode, setCurrentMode] = useState("choice");
  const [isDirty, setIsDirty] = useState(false);
  const [proposition, setProposition] = useState("");
  const [argumentTree, setArgumentTree] = useState({
    id: "root",
    text: "La Terre est ronde", // <-- Texte de test
    causa: null,
    children: [
      {
        id: 1,
        text: "Si elle était ronde les habitants du Sud seraient en dessous",
        causa: "contra",
        parentId: "root",
        children: [
          {
            id: 2,
            text: "Si les habitants étaient en bas, ils tomberaient dans l'espace",
            causa: "pro",
            parentId: 1,
            children: [],
          },
        ],
      },
    ],
  });

  // argumentList n'est plus un état indépendant, mais une simple valeur dérivée de argumentTree.
  const argumentList = argumentTree.children || [];

  const fileInputRef = useRef(null);

  // Déplace toutes tes fonctions ici (handleNew, handleImportInit, etc.)
  const handleNew = () => {
    setProposition("");
    setArgumentTree({
      // <-- RESET l'arbre
      id: "root",
      text: "",
      causa: null,
      children: [],
    });
    // setArgumentList([]); // <-- RESET la liste plate (compatibilité)
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
      text: "Nouvel argument",
      causa: "pro",
      parentId: "root", // Référence directe à la racine
      children: [],
    };
    addChildToNode("root", newArgument);
    setIsDirty(true);
    //setArgumentList((prev) => [...prev, newArgument]);
  };

  // const handleNew = () => {
  //   setProposition("");
  //   setArgumentList([]);
  //   setIsDirty(false);
  // };

  const handleExport = () => {
    // 1. Créer l'objet de données complet (pour plus tard)
    const data = {
      proposition: proposition,
      arguments: argumentTree.children, // On ajoute déjà la structure pour les arguments
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

  const handleImportSuccess = (jsonData) => {
    console.log("Données importées :", jsonData);

    const newTree = {
      id: "root",
      text: jsonData.proposition || "",
      causa: null,
      children: jsonData.arguments || [],
    };

    setProposition(jsonData.proposition || "");
    setArgumentTree(newTree); // <-- ICI, dans la fonction!
    //setArgumentList(newTree.children);
    setIsDirty(false);
    setCurrentMode("editing");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleImportSuccess = (jsonData) => {
  //   if (jsonData.proposition !== undefined) {
  //     setProposition(jsonData.proposition);
  //   }
  //   // Plus tard: setArgumentList(jsonData.arguments || []);
  //   setIsDirty(false);
  // };
  // ... déplace toutes les autres fonctions

  const onEditArgument = (id, newText) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree)); // Deep clone
      const nodeToEdit = findNodeById(newTree, id);
      if (nodeToEdit) {
        nodeToEdit.text = newText;
      }
      return newTree;
    });
    setIsDirty(true);
  };

  const deleteNodeRecursively = (node, targetId) => {
    console.log("Visite du node:", node.id, "cible:", targetId);

    const newChildren = node.children
      .filter((child) => {
        console.log(
          "Filtrage de l'enfant:",
          child.id,
          "keep?",
          child.id !== targetId
        );
        return child.id !== targetId;
      })
      .map((child) => {
        console.log("Application récursive sur:", child.id);
        return deleteNodeRecursively(child, targetId);
      });

    return {
      ...node,
      children: newChildren, // <-- C'EST LA CLÉ !
    };
  };

  // const onDeleteArgument = (id) => {
  //   console.log("Tentative de suppression de l'argument ID:", id);
  //   if (window.confirm("Supprimer cet argument et tous ses sous-arguments ?")) {
  //     setArgumentTree((prevTree) => {
  //       console.log("Arbre avant suppression:", prevTree);
  //       const newTree = deleteNodeRecursively(prevTree, id);
  //       console.log("Arbre après suppression:", newTree);
  //       return newTree;
  //     });
  //     setIsDirty(true);
  //   }
  // };

  const onDeleteArgument = (id) => {
    // 1. Trouver le node concerné dans l'arbre actuel
    const nodeToDelete = findNodeById(argumentTree, id);

    // 2. Vérifier s'il existe et s'il a des enfants
    if (nodeToDelete && nodeToDelete.children.length > 0) {
      // 3. S'il a des enfants, on alerte l'utilisateur et on annule la suppression
      alert(
        "Impossible de supprimer un argument qui a des sous-arguments. Veuillez d'abord supprimer ou déplacer ses sous-arguments."
      );
      return; // On quitte la fonction sans faire de suppression
    }

    // 4. S'il n'a pas d'enfants, on procède à la suppression comme avant
    if (window.confirm("Supprimer cet argument ?")) {
      setArgumentTree((prevTree) => {
        console.log("Arbre avant suppression:", prevTree);
        const newTree = deleteNodeRecursively(prevTree, id);
        console.log("Arbre après suppression:", newTree);
        return newTree;
      });
      setIsDirty(true);
    }
  };

  // Trouve un node par son ID (récursif)
  const findNodeById = (node, targetId) => {
    if (node.id === targetId) return node;
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
    return null;
  };

  // Trouve le parent d'un node (récursif)
  const findParentById = (node, targetId, parent = null) => {
    if (node.id === targetId) return parent;
    for (const child of node.children) {
      const found = findParentById(child, targetId, node);
      if (found) return found;
    }
    return null;
  };

  // Ajoute un enfant à un parent
  const addChildToNode = (parentId, newChild) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree)); // Deep clone
      const parent = findNodeById(newTree, parentId);
      if (parent) {
        parent.children.push(newChild);
      }
      return newTree;
    });
  };

  // Return tout ce dont les composants auront besoin
  return {
    argumentList: argumentTree.children,
    currentMode,
    isDirty,
    proposition,
    argumentTree,
    fileInputRef,
    argumentList,
    handleImportSuccess,
    setArgumentTree, // <-- Expose setArgumentTree pour le test
    //setArgumentList, // <-- Expose setArgumentList pour le test
    setCurrentMode, // <-- Expose setCurrentMode pour le test
    handleNew,
    handleImportInit,
    handleImportSuccess,
    handleNavigateAway,
    handleExport,
    handlePropositionChange,
    handleAddArgument,
    onEditArgument,
    onDeleteArgument,
  };
}
