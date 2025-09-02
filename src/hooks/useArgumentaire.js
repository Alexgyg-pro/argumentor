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

  const [argumentList, setArgumentList] = useState(argumentTree.children); // <-- Initialise avec les enfants
  // const [argumentList, setArgumentList] = useState([]); // Garde pour compatibilité
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
    setArgumentList([]); // <-- RESET la liste plate (compatibilité)
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
    setArgumentTree(newTree);
    setArgumentList(newTree.children);
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
      text: "Nouvel argument",
      causa: "pro",
      parentId: "root", // Référence directe à la racine
      children: [],
    };
    addChildToNode("root", newArgument);
    setIsDirty(true);
    setArgumentList((prev) => [...prev, newArgument]);
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
    // Filtre les enfants qui ne sont pas la cible + applique récursivement
    const newChildren = node.children
      .filter((child) => child.id !== targetId)
      .map((child) => deleteNodeRecursively(child, targetId));

    return {
      ...node,
      children: newChildren,
    };
  };

  // Modifie onDeleteArgument :
  const onDeleteArgument = (id) => {
    if (window.confirm("Supprimer cet argument et tous ses sous-arguments ?")) {
      setArgumentTree((prevTree) => {
        const newTree = deleteNodeRecursively(prevTree, id);
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
    currentMode,
    isDirty,
    proposition,
    argumentList: argumentTree.children,
    argumentTree,
    fileInputRef,
    setArgumentTree, // <-- Expose setArgumentTree pour le test
    onEditArgument,
    onDeleteArgument,
    handleNew,
    handleImportInit,
    handleImportSuccess,
    handleNavigateAway,
    handleExport,
    handlePropositionChange,
    handleAddArgument,
  };
}
