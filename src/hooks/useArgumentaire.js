import { useState, useRef } from "react";

export function useArgumentaire() {
  // États principaux
  const [currentMode, setCurrentMode] = useState("choice");
  const [isDirty, setIsDirty] = useState(false);
  const [thesis, setThesis] = useState({
    text: "", // L'ancienne "proposition"
    forma: "descriptif", // La nouvelle propriété
    causa: "pro",
    children: [],
    // ... autres propriétés futures (source, force, etc.)
  });
  const [argumentTree, setArgumentTree] = useState({
    id: "root",
    text: "La Terre est ronde",
    causa: "pro",
    children: [],
  });

  // Référence pour l'input fichier caché
  const fileInputRef = useRef(null);

  // La liste d'arguments est désormais DÉRIVÉE de l'arbre
  const argumentList = argumentTree.children || [];

  // Fonction pour trouver un nœud par son ID (récursif)
  // useArgumentaire.js
  const findNodeById = (node, targetId) => {
    if (node.id === targetId) {
      // ✅ Comparaison directe string vs string
      return node;
    }

    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) {
        return found;
      }
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
    setThesis({
      text: "",
      forma: "descriptif", // ou une valeur par défaut
    }); // <-- Maintenant correct
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

  // Remplacer l'ancienne version
  const handleThesisChange = (newThesis) => {
    setThesis(newThesis);
    setIsDirty(true);
  };

  const handleAddArgument = () => {
    // 1. Trouver le node parent (la racine)
    const parentNode = argumentTree; // La racine est directement argumentTree

    // 2. Héritage de la forma depuis la racine
    const childForma = thesis.forma || "descriptif"; // Hérite de la thèse

    const newArgument = {
      id: `arg${Date.now()}`, // ✅ Garanti string
      text: "Nouvel argument",
      causa: "pro",
      forma: childForma,
      parentId: "root", // ✅ Doit être string
      children: [],
    };
    addChildToNode("root", newArgument);
    setIsDirty(true);
  };

  // Fonction pour ajouter un argument enfant à un nœud spécifique
  const handleAddChildArgument = (parentId) => {
    // 1. Trouver le node parent dans l'état ACTUEL
    const parentNode = findNodeById(argumentTree, parentId); // <-- Utilise argumentTree

    // 2. HÉRITAGE  : l'enfant hérite de la 'forma' du parent.
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

  const onEditArgument = (id, newProperties) => {
    // newProperties est un objet qui peut contenir { text, causa, forma, ... }
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree)); // Deep clone
      const nodeToEdit = findNodeById(newTree, id);
      if (nodeToEdit) {
        // On écrase les anciennes valeurs par les nouvelles
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
      thesis: thesis, // <-- CHANGE ICI : Exporte l'objet thesis complet
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
    // Dans useArgumentaire.js, fonction handleImportSuccess
    // useArgumentaire.js
    const normalizedArguments = (jsonData.arguments || []).map((arg) => ({
      ...arg,
      id: String(arg.id), // ✅ Force en string
      parentId: arg.parentId ? String(arg.parentId) : "root", // ✅ Force en string
      causa: arg.causa || "pro",
      children: arg.children || [],
    }));

    const newTree = {
      id: "root",
      text: jsonData.thesis?.text || "", // <-- CHANGE ICI : Utilise thesis.text
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
    // Si le node actuel est celui qu'on exclut (et donc tout son sous-arbre), on skip.
    if (currentNode.id === excludedId) {
      return nodeList; // On retourne la liste actuelle sans ajouter ce node ni explorer ses enfants.
    }
    // Ajoute le node actuel à la liste (sauf la racine "root" si tu ne veux pas qu'elle soit choisie)
    if (currentNode.id !== "root") {
      // On exclut souvent la racine de la liste des parents possibles
      nodeList.push({ id: currentNode.id, text: currentNode.text });
    }
    // Parcours récursif des enfants
    currentNode.children.forEach((child) => {
      getAllNodesExceptSubtree(child, excludedId, nodeList);
    });
    return nodeList;
  };

  const handleMoveArgument = (argumentId, newParentId) => {
    setArgumentTree((prevTree) => {
      // 1. Crée une copie profonde de l'arbre
      const newTree = JSON.parse(JSON.stringify(prevTree));

      // 2. Trouve le node à déplacer et son parent actuel
      const nodeToMove = findNodeById(newTree, argumentId);
      const currentParent = findParentById(newTree, argumentId);

      // 3. Trouve le nouveau parent
      const newParent = findNodeById(newTree, newParentId);

      // DEBUG: Ajoute des logs pour voir ce qui est trouvé
      console.log("Node à déplacer:", nodeToMove);
      console.log("Parent actuel:", currentParent);
      console.log("Nouveau parent:", newParent);
      console.log("ID du nouveau parent demandé:", newParentId);

      // 4. Si tout est trouvé, procède au déplacement
      if (nodeToMove && currentParent && newParent) {
        // a. Retire le node des enfants de son parent actuel
        currentParent.children = currentParent.children.filter(
          (child) => child.id !== argumentId
        );
        // b. Ajoute le node aux enfants du nouveau parent
        newParent.children.push(nodeToMove);
        // c. Met à jour le parentId du node déplacé (si tu utilises ce champ)
        nodeToMove.parentId = newParentId;
      } else {
        console.error(
          "Échec du déplacement : node, parent actuel ou nouveau parent introuvable."
        );
      }

      return newTree;
    });
    setIsDirty(true);
  };

  // Trouve le parent d'un node (récursif) - FONCTION NÉCESSAIRE
  const findParentById = (node, targetId, parent = null) => {
    if (node.id === targetId) {
      // ✅ Comparaison directe string vs string
      return parent;
    }

    for (const child of node.children) {
      const found = findParentById(child, targetId, node);
      if (found) {
        return found;
      }
    }

    return null;
  };

  const getArgumentCode = (targetNodeId) => {
    console.log("🔍 getArgumentCode appelée pour l'ID:", targetNodeId);
    const currentNode = findNodeById(argumentTree, targetNodeId);
    if (!currentNode || currentNode.id === "root") {
      console.log("↳ Cible non trouvée ou c'est la racine. Retourne ''");
      return "";
    }

    const parentNode = findParentById(argumentTree, targetNodeId);
    if (!parentNode) {
      console.log("↳ Parent non trouvé. Retourne ''");
      return "";
    }

    // 1. Récupère le code du parent (hérité, en minuscules)
    let inheritedCode = "";
    console.log(`↳ Parent ID: ${parentNode.id}, Target ID: ${targetNodeId}`);
    if (parentNode.id !== "root") {
      console.log(
        `↳ Parent n'est pas la racine. Calcul récursif du code pour le parent ${parentNode.id}...`
      );
      inheritedCode = getArgumentCode(parentNode.id).toLowerCase();
      console.log(`↳ Code hérité récupéré: '${inheritedCode}'`);
    } else {
      console.log("↳ Parent est la racine. Pas de code hérité.");
    }

    // 2. Trouve l'index du node cible parmi TOUS les enfants du parent
    // (C'est une version simplifiée, on affine après)
    const siblings = parentNode.children;
    const ownIndex = siblings.findIndex(
      (sibling) => sibling.id === targetNodeId
    );
    const position = ownIndex + 1; // findIndex retourne 0 pour le 1er, donc on +1

    // 3. Construit la nouvelle partie du code basée sur la causa
    const newSegment = `${currentNode.causa === "pro" ? "P" : "C"}${position}`;

    // 4. Concatène et retourne
    const finalCode = inheritedCode + newSegment;
    console.log(`↳ Code final pour ${targetNodeId}: '${finalCode}'`);
    return finalCode;
  };

  // On expose uniquement ce qui est nécessaire aux composants
  return {
    argumentList,
    currentMode,
    isDirty,
    // proposition,
    thesis,
    argumentTree,
    fileInputRef,
    handleNew,
    handleImportInit,
    handleFileChange, // NOUVEAU - exporté pour App.jsx
    handleNavigateAway,
    handleExport,
    // handlePropositionChange,
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
