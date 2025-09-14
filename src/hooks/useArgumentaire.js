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

  const [potentialParents, setPotentialParents] = useState([]);

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
      validity: 0.5,
      relevance: 0.5,
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
      validity: 0.5,
      relevance: 0.5,
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
      version: "1.1",
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
      validity: arg.validity ?? 0.5, // ← Nouveau
      relevance: arg.relevance ?? 0.5, // ← Nouveau
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

  const getAllNodesExceptSubtree = (
    currentNode,
    excludedId,
    nodeList = [],
    thesisText = ""
  ) => {
    if (currentNode.id === excludedId) {
      if (excludedId !== "root") {
        nodeList.push({
          id: "root",
          text: thesisText
            ? `Thèse: ${thesisText.substring(0, 30)}${
                thesisText.length > 30 ? "..." : ""
              }`
            : "[Thèse principale]",
        });
      }
      return nodeList;
    }
    if (currentNode.id !== "root") {
      nodeList.push({ id: currentNode.id, text: currentNode.text });
    }
    currentNode.children.forEach((child) => {
      getAllNodesExceptSubtree(child, excludedId, nodeList, thesisText);
    });
    return nodeList;
  };

  const handleMoveArgument = (argumentId, newParentId) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToMove = findNodeById(newTree, argumentId);
      const currentParent = findParentById(newTree, argumentId);

      // CAS SPÉCIAL : Déplacement vers la racine
      if (newParentId === "root") {
        if (currentParent) {
          currentParent.children = currentParent.children.filter(
            (child) => child.id !== argumentId
          );
        }
        newTree.children.push(nodeToMove);
        nodeToMove.parentId = "root";
      } else {
        const newParent = findNodeById(newTree, newParentId);
        if (nodeToMove && currentParent && newParent) {
          currentParent.children = currentParent.children.filter(
            (child) => child.id !== argumentId
          );
          newParent.children.push(nodeToMove);
          nodeToMove.parentId = newParentId;
        }
      }

      return newTree;
    });
    setIsDirty(true);
  };

  const calculateArgumentScore = (argument, thesisForma) => {
    // Descriptive: vérité + logique
    if (thesisForma === "descriptif") {
      return argument.validity * argument.relevance;
    }
    // Normative: conséquences + valeurs
    else {
      return argument.validity * argument.relevance;
    }
  };

  // Fonction de calcul récursif avec prise en compte de la forma
  const calculateGlobalScore = useCallback(
    (node = argumentTree, forma = thesis.forma) => {
      if (node.id === "root") {
        // Racine : calculer sur les enfants seulement
        if (!node.children || node.children.length === 0) return 0.5;
        const childScores = node.children.map((child) =>
          calculateGlobalScore(child, forma)
        );
        return (
          childScores.reduce((sum, score) => sum + score, 0) /
          childScores.length
        );
      }

      // Calcul du score du nœud courant selon sa forma
      const nodeScore = (node.validity ?? 0.5) * (node.relevance ?? 0.5);

      if (!node.children || node.children.length === 0) {
        return nodeScore; // Feuille de l'arbre
      }

      // Nœud avec enfants : combiner avec les scores enfants
      const childScores = node.children.map((child) =>
        calculateGlobalScore(child, forma)
      );
      const averageChildScore =
        childScores.reduce((sum, score) => sum + score, 0) / childScores.length;

      // Pondération selon le type de thèse
      if (forma === "descriptif") {
        return nodeScore * 0.6 + averageChildScore * 0.4;
      } else {
        return nodeScore * 0.4 + averageChildScore * 0.6;
      }
    },
    [argumentTree, thesis.forma]
  );

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
    calculateGlobalScore,
  };
}
