import { useState, useRef, useCallback, useEffect } from "react";
import {
  findNodeById,
  findParentById,
  deleteNodeRecursively,
  addChildToNode,
} from "../utils/argumentOperations";
import {
  calculateGlobalScore,
  //recalculateAllCodes,
  getArgumentCode as getCode,
} from "../utils/calculations";
import {
  normalizeArguments,
  exportArgumentaire,
  handleImport,
} from "../utils/importExport";

export const recalculateAllCodes = (argumentTree, findParentById) => {
  const newCodes = {};

  const calculateCodeForNode = (node, parentCode = "") => {
    if (node.id === "root") return;

    const parent = findParentById(argumentTree, node.id);
    const siblings = parent?.children || [];
    const index = siblings.findIndex((sibling) => sibling.id === node.id);
    const segment = `${node.causa === "pro" ? "P" : "C"}${index + 1}`;
    const code = parentCode + segment;

    newCodes[node.id] = code;
    node.children.forEach((child) =>
      calculateCodeForNode(child, code.toLowerCase())
    );
  };

  argumentTree.children.forEach((child) => calculateCodeForNode(child, ""));
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
  const [needsRecalculation, setNeedsRecalculation] = useState(false);
  const fileInputRef = useRef(null);

  // DÉRIVÉS
  const argumentList = argumentTree.children || [];

  // GESTIONNAIRES D'ÉVÉNEMENTS
  const handleNew = () => {
    setThesis({ text: "", forma: "descriptif" });
    setArgumentTree({ id: "root", text: "", causa: null, children: [] });
    setIsDirty(false);
    setCurrentMode("editing");
    setIsNewThesis(true);
  };

  const handleImportInit = () => fileInputRef.current?.click();

  const handleFileChange = (e) =>
    handleImport(e.target.files[0], (jsonData) => {
      handleNavigateAway(() => handleImportSuccess(jsonData));
    });

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
    console.log("📈 Setting needsRecalculation to TRUE");
    const newArgument = createArgument("root", thesis.forma);
    setArgumentTree((prevTree) =>
      addChildToNode(prevTree, "root", newArgument)
    );
    setNeedsRecalculation(true);
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
      return newTree;
    });

    setNeedsRecalculation(true);
    setIsDirty(true);
  };

  const onEditArgument = (id, newProperties) => {
    setArgumentTree((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const nodeToEdit = findNodeById(newTree, id);
      if (nodeToEdit) Object.assign(nodeToEdit, newProperties);
      return newTree;
    });
    setNeedsRecalculation(true);
    setIsDirty(true);
  };

  const onDeleteArgument = (id) => {
    const nodeToDelete = findNodeById(argumentTree, id);
    if (nodeToDelete?.isTemporary) {
      setArgumentTree((prevTree) => deleteNodeRecursively(prevTree, id));
      setIsDirty(true);
      return;
    }
    if (window.confirm("Supprimer cet argument ?")) {
      setArgumentTree((prevTree) => deleteNodeRecursively(prevTree, id));
      setIsDirty(true);
    }
  };

  const handleExport = () => {
    const data = exportArgumentaire(thesis, argumentTree);
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
    setNeedsRecalculation(true);
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

      setNeedsRecalculation(true);
      return newTree;
    });
    setIsDirty(true);
  };

  // CALCULS
  const recalculateScores = () => {
    calculateGlobalScore(argumentTree, thesis.forma);
    setNeedsRecalculation(false);
  };

  // useEffect(() => {
  //   if (needsRecalculation) {
  //     calculateGlobalScore(argumentTree, thesis.forma);
  //     setNeedsRecalculation(false);
  //   }
  // }, [needsRecalculation]);

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
  //   console.log("🔄 recalculateAllCodes triggered");
  //   const newCodes = recalculateAllCodes(argumentTree, findParentById);
  //   setArgumentCodes(newCodes);
  // }, [argumentTree]);

  useEffect(() => {
    console.log("🧪 TEST: Forcing code calculation");
    const newCodes = recalculateAllCodes(argumentTree, findParentById);
    console.log("🧪 Codes calculés:", newCodes);
    setArgumentCodes(newCodes);
  }, [argumentTree]); // ← seulement au mount

  // EXPOSITION
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
    handleMoveArgument,
    isNewThesis,
    setIsNewThesis,
    setCurrentMode,
    recalculateScores,
    needsRecalculation,
    needsRecalculation, // ← BIEN EXPOSER
    recalculateScores, // ← BIEN EXPOSER
    getAllNodesExceptSubtree,
    getArgumentCode: (targetNodeId) => getCode(argumentCodes, targetNodeId),
  };
}

// Helper local
const createArgument = (parentId, forma) => ({
  id: `temp-${Date.now()}`,
  text: "",
  causa: "neutralis",
  forma: forma || "descriptif",
  natura: "validity",
  value: 0.5,
  validity: 0.5,
  relevance: 0.5,
  parentId,
  children: [],
  isTemporary: true,
});
