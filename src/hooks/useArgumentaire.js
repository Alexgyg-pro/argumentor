import { useState, useRef, useCallback, useEffect } from "react";

export function useArgumentaire() {
  // États principaux
  const [currentMode, setCurrentMode] = useState("choice");
  const [isDirty, setIsDirty] = useState(false);
  const [thesis, setThesis] = useState({
    text: "",
    forma: "descriptif",
    causa: "pro",
    children: [],
  });
  const [argumentTree, setArgumentTree] = useState({
    id: "root",
    text: "",
    causa: null,
    children: [],
  });

  // Nouveau state pour mémoriser les codes
  const [argumentCodes, setArgumentCodes] = useState({});

  // Référence pour l'input fichier caché
  const fileInputRef = useRef(null);

  // La liste d'arguments est désormais DÉRIVÉE de l'arbre
  const argumentList = argumentTree.children || [];

  // Fonction pour trouver un nœud par son ID (récursif)
  const findNodeById = useCallback((node, targetId) => {
    if (node.id === targetId) return node;
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
    return null;
  }, []);

  // Fonction récursive pour supprimer un nœud
  const deleteNodeRecursively = useCallback((node, targetId) => {
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
  }, []);

  // Trouve le parent d'un node (récursif)
  const findParentById = useCallback((node, targetId, parent = null) => {
    if (node.id === targetId) {
      return parent;
    }
    for (const child of node.children) {
      const found = findParentById(child, targetId, node);
      if (found) return found;
    }
    return null;
  }, []);

  // Fonction pour recalculer TOUS les codes de manière optimisée
  const recalculateAllCodes = useCallback(
    (tree = argumentTree) => {
      const newCodes = {};

      const calculateCodeForNode = (node, parentCode = "") => {
        if (node.id === "root") return;

        // Trouver les frères et soeurs
        const parent = findParentById(tree, node.id);
        const siblings = parent?.children || [];
        const index = siblings.findIndex((sibling) => sibling.id === node.id);

        // Calculer le segment du code
        const segment = `${node.causa === "pro" ? "P" : "C"}${index + 1}`;
        const code = parentCode + segment;

        newCodes[node.id] = code;

        // Calculer récursivement pour les enfants
        node.children.forEach((child) =>
          calculateCodeForNode(child, code.toLowerCase())
        );
      };

      // Calculer pour tous les enfants de la racine
      tree.children.forEach((child) => calculateCodeForNode(child, ""));
      setArgumentCodes(newCodes);
    },
    [argumentTree, findParentById]
  );

  // Mémorisation des codes - version optimisée
  const getArgumentCode = useCallback(
    (targetNodeId) => {
      return argumentCodes[targetNodeId] || "";
    },
    [argumentCodes]
  );

  // Recalculer les codes quand l'arbre change
  useEffect(() => {
    recalculateAllCodes();
  }, [argumentTree, recalculateAllCodes]);

  // GESTIONNAIRES D'ÉVÉNEMENTS

  const handleNew = () => {
    setThesis({
      text: "",
      forma: "descriptif",
    });
    setArgumentTree({
      id: "root",
      text: "",
      causa: null,
      children: [],
    });
    setArgumentCodes({}); // Reset les codes
    setIsDirty(false);
    setCurrentMode("editing");
  };

  const handleImportInit = () => {
    fileInputRef.current?.click();
  };

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

  const handleThesisChange = (newThesis) => {
    setThesis(newThesis);
    setIsDirty(true);
  };

  const handleAddArgument = () => {
    const childForma = thesis.forma || "descriptif";

    const newArgument = {
      id: `arg${Date.now()}`,
      text: "Nouvel argument",
      causa: "pro",
      forma: childForma,
      parentId: "root",
      children: [],
    };
    addChildToNode("root", newArgument);
    setIsDirty(true);
  };

  const handleAddChildArgument = (parentId) => {
    const parentNode = findNodeById(argumentTree, parentId);
    const childForma = parentNode.forma || "descriptif";

    const newArgument = {
      id: `arg${Date.now()}`,
      text: "Nouvel argument",
      causa: "pro",
      forma: childForma,
      parentId: parentId,
      children: [],
    };

    addChildToNode(parentId, newArgument);
    setIsDirty(true);
  };

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

  const onEditArgument = (id, newProperties) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToEdit = findNodeById(newTree, id);
      if (nodeToEdit) {
        Object.assign(nodeToEdit, newProperties);
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
      thesis: thesis,
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

  const handleImportSuccess = (jsonData) => {
    const normalizedArguments = (jsonData.arguments || []).map((arg) => ({
      ...arg,
      id: String(arg.id),
      parentId: arg.parentId ? String(arg.parentId) : "root",
      causa: arg.causa || "pro",
      children: arg.children || [],
    }));

    const newTree = {
      id: "root",
      text: jsonData.thesis?.text || "",
      causa: null,
      children: normalizedArguments,
    };

    setThesis({
      text: jsonData.thesis?.text || "",
      forma: jsonData.thesis?.forma || "descriptif",
    });

    setArgumentTree(newTree);
    setIsDirty(false);
    setCurrentMode("editing");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAllNodesExceptSubtree = (currentNode, excludedId, nodeList = []) => {
    if (currentNode.id === excludedId) {
      return nodeList;
    }
    if (currentNode.id !== "root") {
      nodeList.push({ id: currentNode.id, text: currentNode.text });
    }
    currentNode.children.forEach((child) => {
      getAllNodesExceptSubtree(child, excludedId, nodeList);
    });
    return nodeList;
  };

  const handleMoveArgument = (argumentId, newParentId) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToMove = findNodeById(newTree, argumentId);
      const currentParent = findParentById(newTree, argumentId);
      const newParent = findNodeById(newTree, newParentId);

      if (nodeToMove && currentParent && newParent) {
        currentParent.children = currentParent.children.filter(
          (child) => child.id !== argumentId
        );
        newParent.children.push(nodeToMove);
        nodeToMove.parentId = newParentId;
      }

      return newTree;
    });
    setIsDirty(true);
  };

  // On expose uniquement ce qui est nécessaire aux composants
  return {
    argumentList,
    currentMode,
    isDirty,
    thesis,
    argumentTree,
    fileInputRef,
    handleNew,
    handleImportInit,
    handleFileChange,
    handleNavigateAway,
    handleExport,
    handleThesisChange,
    handleAddArgument,
    onEditArgument,
    onDeleteArgument,
    handleImportSuccess,
    handleAddChildArgument,
    getAllNodesExceptSubtree,
    handleMoveArgument,
    getArgumentCode,
  };
}
