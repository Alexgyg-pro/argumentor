import { useState, useRef, useEffect } from "react";
import { useFileImport } from "./useFileImport";
import {
  findNodeById,
  findParentById,
  deleteNodeRecursively,
  addChildToNode,
} from "../utils/argumentOperations";
import {
  calculateGlobalScore,
  getArgumentCode as getCode,
} from "../utils/calculations";
import {
  normalizeArguments,
  exportArgumentaire,
  handleImport,
} from "../utils/importExport";

export const recalculateAllCodes = (argumentTree, findParentById) => {
  const [isNewThesis, setIsNewThesis] = useState(false);
  const newCodes = {};

  const calculateCodeForNode = (node, parentCode = "") => {
    if (node.id === "root") return;
    console.log("🔍 DEBUG NODE:", {
      id: node.id,
      causa: node.causa,
      text: node.text,
    });
    const parent = findParentById(argumentTree, node.id);
    const siblings = parent?.children || [];

    // FILTRER les frères du même type seulement
    const sameTypeSiblings = siblings.filter(
      (sibling) => sibling.causa === node.causa
    );
    const index = sameTypeSiblings.findIndex(
      (sibling) => sibling.id === node.id
    );

    const segment = `${
      node.causa === "pro" ? "P" : node.causa === "contra" ? "C" : "N"
    }${index + 1}`;

    const code = parentCode + segment;

    newCodes[node.id] = code;
    node.children.forEach((child) =>
      calculateCodeForNode(child, code.toLowerCase())
    );
  };

  if (argumentTree.children) {
    argumentTree.children.forEach((child) => calculateCodeForNode(child, ""));
  }

  return newCodes;
};

export const getArgumentCode = (argumentCodes, targetNodeId) => {
  return argumentCodes[targetNodeId] || "";
};

export function useArgumentaire() {
  // ÉTATS
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
  const [argumentCodes, setArgumentCodes] = useState({});
  const [isNewThesis, setIsNewThesis] = useState(false);
  const [references, setReferences] = useState([]);
  // const fileInputRef = useRef(null);

  // DÉRIVÉS
  const argumentList = argumentTree.children || [];

  // FONCTIONS DE GESTION DES RÉFÉRENCES
  const addReference = (reference) => {
    const newReference = {
      id: `ref${String(references.length + 1).padStart(5, "0")}`,
      title: reference.title,
      content: reference.content || "",
    };
    setReferences((prev) => [...prev, newReference]);
    return newReference.id;
  };

  const updateReference = (id, updatedReference) => {
    setReferences((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, ...updatedReference } : ref))
    );
  };

  const deleteReference = (id) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
  };

  // GESTIONNAIRES D'ÉVÉNEMENTS
  // const handleNew = () => {
  //   setThesis({ text: "", forma: "descriptif" });
  //   setArgumentTree({ id: "root", text: "", causa: null, children: [] });
  //   setIsDirty(false);
  //   setCurrentMode("editing");
  //   setIsNewThesis(true);
  // };

  // Remplacer la gestion fichier actuelle par le hook
  const { fileInputRef, handleImportInit, handleFileChange } = useFileImport(
    (file) => {
      handleImport(file, (jsonData) => {
        handleNavigateAway(() => handleImportSuccess(jsonData));
      });
    }
  );

  /*
  const handleImportInit = () => fileInputRef.current?.click();

  const handleFileChange = (e) =>
    handleImport(e.target.files[0], (jsonData) => {
      handleNavigateAway(() => handleImportSuccess(jsonData));
    });
*/

  const handleNavigateAway = (action) => {
    if (!isDirty) return action();
    if (window.confirm("Sauvegarder avant de quitter ?")) handleExport();
    action();
    setIsDirty(false);
  };

  const handleThesisChange = (newThesis) => {
    setThesis(newThesis);
    setIsDirty(true);
  };

  const handleAddArgument = () => {
    console.log("📈 Adding argument");
    const newArgument = createArgument("root", thesis.forma);

    setArgumentTree((prevTree) => {
      const newTree = addChildToNode(prevTree, "root", newArgument);

      // RECALCUL IMMÉDIAT
      console.log("🧪 Recalculating codes after add");
      const newCodes = recalculateAllCodes(newTree, (node, targetId) =>
        findParentById(node, targetId)
      );
      setArgumentCodes(newCodes);

      return newTree;
    });

    setIsDirty(true);
  };

  const handleAddChildArgument = (parentId) => {
    console.log("➕ handleAddChildArgument pour parent:", parentId);
    const parentNode = findNodeById(argumentTree, parentId);
    console.log("Parent trouvé:", parentNode);

    const newArgument = createArgument(parentId, parentNode.forma);
    console.log("Nouvel argument créé:", newArgument);

    setArgumentTree((prevTree) => {
      const newTree = addChildToNode(prevTree, parentId, newArgument);
      console.log("Nouvel arbre:", newTree);

      // RECALCUL IMMÉDIAT
      console.log("🧪 Recalculating codes after add child");
      const newCodes = recalculateAllCodes(newTree, (node, targetId) =>
        findParentById(node, targetId)
      );
      setArgumentCodes(newCodes);

      return newTree;
    });

    setIsDirty(true);
  };

  const onEditArgument = (id, newProperties) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToEdit = findNodeById(newTree, id);
      if (nodeToEdit) {
        // Gérer spécifiquement les références si présentes
        if (newProperties.references !== undefined) {
          nodeToEdit.references = newProperties.references;
        }
        Object.assign(nodeToEdit, newProperties);
      }

      // RECALCUL IMMÉDIAT
      console.log("🧪 Recalculating codes after edit");
      const newCodes = recalculateAllCodes(newTree, (node, targetId) =>
        findParentById(node, targetId)
      );
      setArgumentCodes(newCodes);

      return newTree;
    });

    setIsDirty(true);
  };

  const onDeleteArgument = (id) => {
    console.log("🗑️ DELETE called for:", id);

    const nodeToDelete = findNodeById(argumentTree, id);
    console.log("Node details:", {
      id: nodeToDelete?.id,
      isTemporary: nodeToDelete?.isTemporary,
      text: nodeToDelete?.text,
      textTrimmed: nodeToDelete?.text?.trim(),
      isEmpty: !nodeToDelete?.text?.trim(),
      hasChildren: nodeToDelete?.children?.length > 0,
    });

    // Vérifier si l'argument a des enfants
    if (nodeToDelete?.children && nodeToDelete.children.length > 0) {
      console.log("❌ Has children, blocking deletion");
      alert(
        "Impossible de supprimer cet argument : il contient des sous-arguments. Veuillez d'abord les déplacer ou les supprimer."
      );
      return;
    }

    // SUPPRIMER sans confirmation SEULEMENT si l'argument est VIDE
    if (!nodeToDelete?.text.trim()) {
      console.log("🔥 Deleting empty argument without confirmation");
      setArgumentTree((prevTree) => deleteNodeRecursively(prevTree, id));
      setIsDirty(true);
      return;
    }

    console.log("⚠️ Asking for confirmation for non-empty argument");
    if (window.confirm("Supprimer cet argument ?")) {
      console.log("✅ Confirmed, deleting...");
      setArgumentTree((prevTree) => deleteNodeRecursively(prevTree, id));
      setIsDirty(true);
    } else {
      console.log("❌ Deletion cancelled");
    }
  };

  const handleExport = () => {
    const data = exportArgumentaire(thesis, argumentTree, references);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "argumentaire.json";
    a.click();
    URL.revokeObjectURL(url);
    setIsDirty(false);
  };

  const handleImportSuccess = (jsonData) => {
    const normalizedArguments = normalizeArguments(jsonData.arguments || []);
    setThesis({
      text: jsonData.thesis?.text || "",
      forma: jsonData.thesis?.forma || "descriptif",
    });
    setArgumentTree({
      id: "root",
      text: jsonData.thesis?.text || "",
      causa: null,
      children: normalizedArguments,
    });
    setIsDirty(false);
    setCurrentMode("editing");
  };

  const handleMoveArgument = (argumentId, newParentId) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToMove = findNodeById(newTree, argumentId);
      const currentParent = findParentById(newTree, argumentId);
      const newParent = findNodeById(newTree, newParentId);

      if (nodeToMove && currentParent && newParent) {
        // 1. RETIRER de l'ancien parent
        currentParent.children = currentParent.children.filter(
          (child) => child.id !== argumentId
        );

        // 2. AJOUTER au nouveau parent D'ABORD
        newParent.children.push(nodeToMove);
        nodeToMove.parentId = newParentId;

        // 3. METTRE EN NEUTRE APRÈS l'ajout
        const setNeutralRecursively = (node) => {
          node.causa = "neutralis";
          node.children.forEach(setNeutralRecursively);
        };
        setNeutralRecursively(nodeToMove);
      }

      return newTree;
    });
    setIsDirty(true);
  };

  // CALCULS
  const recalculateScores = () => {
    calculateGlobalScore(argumentTree, thesis.forma);
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

  // useEffect(() => {
  //   console.log("🧪 TEST: Forcing code calculation");
  //   const newCodes = recalculateAllCodes(argumentTree, (node, targetId) =>
  //     findParentById(node, targetId)
  //   );
  //   console.log("🧪 Codes calculés:", newCodes);
  //   setArgumentCodes(newCodes);
  // }, [argumentTree]);

  // EXPOSITION
  return {
    argumentList,
    currentMode,
    isDirty,
    thesis,
    argumentTree,
    fileInputRef,
    // handleNew,
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
    handleMoveArgument,
    isNewThesis,
    setIsNewThesis,
    setCurrentMode,
    recalculateScores,
    getAllNodesExceptSubtree,
    getArgumentCode: (targetNodeId) => getCode(argumentCodes, targetNodeId),
    references, // ← exposé
    addReference,
    updateReference,
    deleteReference,
  };
}
let argumentCounter = 1; // ← Garder le compteur global
// Helper local
const createArgument = (parentId, forma) => ({
  id: `arg${String(argumentCounter++).padStart(5, "0")}`, // ← arg00001, arg00002
  text: "",
  textComment: "",
  references: [],
  causa: "neutralis",
  forma: forma || "descriptif",
  natura: "validity",
  value: 0.5,
  validity: 0.5,
  relevance: 0.5,
  parentId,
  children: [],
  isTemporary: true,
  fileInputRef,
  handleImportInit: handleImportInit, // Maintenant du hook
  handleImport: handleFileChange, // La logique métier
  handleNavigateAway, // Pour les confirmations
});
