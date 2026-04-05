// src/hooks/useArguments.js

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  findArgumentById,
  getNextArgumentId,
  getPossibleNewParents,
  recalculateCodesAndColors,
  findParentById,
} from "../utils/argumentUtils";
import {
  getNextId,
  initializeCountersFromItems,
  resetCounter,
  getCounter,
} from "../utils/idUtils";
import { computeScores, computeGlobalScore } from "../utils/scoreUtils";

const extractAllArguments = (tree) => {
  const args = [];
  const traverse = (node) => {
    if (node.id && node.id.startsWith("arg")) {
      args.push(node);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  traverse(tree);
  return args;
};

export function useArguments(initialArgumentTree = null) {
  const [argumentTree, setArgumentTree] = useState(
    initialArgumentTree || {
      id: "root",
      claim: "",
      children: [],
    },
  );
  const [lineMode, setLineMode] = useState(new Set());
  const [expandedNodes, setExpandedNodes] = useState(new Set(["root"]));
  const [expandedParents, setExpandedParents] = useState(new Set()); // Parents dont on voit les enfants

  const [argumentCodes, setArgumentCodes] = useState({});

  // Recalculer les codes/couleurs quand l'arbre change
  useEffect(() => {
    if (argumentTree) {
      const codes = recalculateCodesAndColors(
        argumentTree,
        findParentById,
        true,
      );
      setArgumentCodes(codes);
    }
  }, [argumentTree]);

  // Arbre avec scores calculés (validity, relevance, weight)
  const scoredTree = useMemo(() => {
    if (!argumentTree) return null;
    return computeScores(argumentTree);
  }, [argumentTree]);

  // Score global de l'argumentaire ∈ ]-10 ; +10[
  const globalScore = useMemo(() => {
    if (!scoredTree || !argumentCodes) return null;
    return computeGlobalScore(scoredTree, argumentCodes);
  }, [scoredTree, argumentCodes]);

  const getArgumentCode = useCallback(
    (argumentId) => {
      return argumentCodes[argumentId]?.code || `#${argumentId}`;
    },
    [argumentCodes],
  );

  // Fonction pour obtenir la couleur d'un argument
  const getArgumentColor = useCallback(
    (argumentId) => {
      return argumentCodes[argumentId]?.color || "gray";
    },
    [argumentCodes],
  );

  const addArgument = useCallback(
    (parentId, data) => {
      const newId = getNextId("arg"); // Générer l'ID une seule fois

      const newArg = {
        id: newId,
        parentId,
        claim: data.claim || "",
        claimComment: data.claimComment || "",
        causa: data.causa || "neutralis",
        forma: data.forma || "descriptif",
        natura: data.natura || "validity",
        value: data.value ?? 0.5,
        references: data.references || [],
        children: [],
      };

      if (!argumentTree) {
        setArgumentTree({
          id: parentId,
          claim: "Thèse principale",
          children: [newArg],
        });
        return;
      }

      const addToTree = (node) => {
        if (node.id === parentId) {
          return { ...node, children: [...(node.children || []), newArg] };
        }
        if (node.children) {
          return { ...node, children: node.children.map(addToTree) };
        }
        return node;
      };

      setArgumentTree((prev) => addToTree(prev));
    },
    [argumentTree],
  );

  const updateArgument = useCallback(
    (id, data) => {
      if (!argumentTree) return;

      const updateInTree = (node) => {
        if (node.id === id) {
          return { ...node, ...data };
        }
        if (node.children) {
          return { ...node, children: node.children.map(updateInTree) };
        }
        return node;
      };

      setArgumentTree((prev) => updateInTree(prev));
    },
    [argumentTree],
  );

  const deleteArgument = useCallback(
    (id) => {
      if (!argumentTree) return;

      const arg = findArgumentById(argumentTree, id);
      if (arg && arg.children && arg.children.length > 0) {
        alert("Impossible de supprimer un argument qui a des sous-arguments.");
        return;
      }

      if (!window.confirm("Supprimer cet argument ?")) return;

      const deleteFromTree = (node) => {
        if (node.children) {
          return {
            ...node,
            children: node.children.filter((child) => child.id !== id),
          };
        }
        return node;
      };

      setArgumentTree((prev) => deleteFromTree(prev));
    },
    [argumentTree],
  );

  const moveArgument = useCallback((argumentId, newParentId) => {
    setArgumentTree((prevTree) => {
      if (!prevTree) return prevTree;

      // 1. Copie profonde
      const treeCopy = JSON.parse(JSON.stringify(prevTree));

      // 2. Fonction de recherche
      const findInCopy = (node, targetId) => {
        if (node.id === targetId) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findInCopy(child, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const argument = findInCopy(treeCopy, argumentId);
      const oldParent = argument
        ? findInCopy(treeCopy, argument.parentId)
        : null;
      const newParent = findInCopy(treeCopy, newParentId);

      if (!argument || !oldParent || !newParent) return prevTree;

      // 3. Fonction qui modifie DIRECTEMENT dans treeCopy
      const transformInTree = (nodeId) => {
        const node = findInCopy(treeCopy, nodeId);
        if (node) {
          node.causa = "neutralis";
          if (node.children) {
            node.children.forEach((child) => {
              transformInTree(child.id);
            });
          }
        }
      };

      // 4. Appliquer la transformation
      transformInTree(argumentId);

      // 5. Retirer de l'ancien parent
      oldParent.children = oldParent.children.filter(
        (child) => child.id !== argumentId,
      );

      // 7. Mettre à jour le parentId
      argument.parentId = newParentId;

      // 8. Ajouter au nouveau parent
      newParent.children = newParent.children || [];
      newParent.children.push(argument);

        return treeCopy;
    });
  }, []);

  const getPossibleParents = useCallback(
    (argumentId) => {
      return getPossibleNewParents(argumentTree, argumentId);
    },
    [argumentTree],
  );

  const importArguments = useCallback((importedTree) => {
    // console.log("📥 IMPORT - Initialisation des compteurs");
    const allArgs = extractAllArguments(importedTree);
    // console.log(
    //   "📊 Arguments détectés:",
    //   allArgs.map((a) => a.id)
    // );
    initializeCountersFromItems(allArgs, "arg");
    setArgumentTree(importedTree);
  }, []);

  const resetArguments = useCallback(() => {
    // console.log("🔄 resetArguments - Réinitialisation complète");
    resetCounter("arg");
    setArgumentTree(null);
  }, []);

  const setArguments = useCallback((newTree) => {
    if (newTree) {
      const allArgs = extractAllArguments(newTree);

      initializeCountersFromItems(allArgs, "arg");
    } else {
      resetCounter("arg");
    }
    setArgumentTree(newTree);
  }, []);

  const countAllArguments = (tree) => {
    let count = 0;

    const traverse = (node) => {
      if (node.id !== "root") count++;
      node.children?.forEach(traverse);
    };

    traverse(tree);
    return count;
  };

  const countNeutralArguments = (tree) => {
    let count = 0;

    const traverse = (node) => {
      if (node.causa === "neutralis") {
        count++;
      }
      node.children?.forEach(traverse);
    };

    if (tree && tree.children) {
      tree.children.forEach(traverse);
    }

    return count;
  };

  const allToLineMode = useCallback(() => {
    if (!argumentTree) return;

    const allIds = new Set();
    const collectIds = (node) => {
      if (node.id && node.id !== "root") allIds.add(node.id);
      node.children?.forEach(collectIds);
    };

    collectIds(argumentTree);
    setLineMode(allIds);
  }, [argumentTree]);

  const allToCardMode = useCallback(() => {
    setLineMode(new Set());
  }, []);

  const toggleLineMode = useCallback((argumentId) => {
    setLineMode((prev) => {
      const next = new Set(prev);
      if (next.has(argumentId)) {
        next.delete(argumentId);
      } else {
        next.add(argumentId);
      }
      return next;
    });
  }, []);

  // Toggle un nœud spécifique
  const toggleNodeExpansion = useCallback(
    (nodeId) => {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
    },
    [expandedNodes],
  );

  const expandAllNodes = useCallback(() => {
    if (!argumentTree) {
      console.log("   ❌ Arbre vide");
      return;
    }
    const allIds = new Set(["root"]);
    const collectIds = (node) => {
      if (node.id) allIds.add(node.id);
      node.children?.forEach(collectIds);
    };
    collectIds(argumentTree);
    setExpandedNodes(allIds);
  }, [argumentTree]);

  const collapseAllNodes = useCallback(() => {
    setExpandedNodes(new Set(["root"]));
  }, []);

  // Vérifier si un nœud est développé
  const isNodeExpanded = useCallback(
    (nodeId) => {
      return expandedNodes.has(nodeId);
    },
    [expandedNodes],
  );

  return {
    // État
    argumentTree,
    argumentCodes,

    // Scores calculés
    scoredTree,
    globalScore,

    // Fonctions CRUD
    addArgument,
    updateArgument,
    deleteArgument,
    moveArgument,

    // Fonctions utilitaires
    getPossibleParents,
    findArgumentById: (id) => findArgumentById(argumentTree, id),
    countAllArguments: () => countAllArguments(argumentTree),
    countNeutralArguments: () => countNeutralArguments(argumentTree),
    getArgumentCode,
    getArgumentColor,

    // Import/export
    importArguments,
    resetArguments,
    setArguments,  // fix: était setArgumentTree (le setter brut)

    // Line/Card-mode
    lineMode,
    allToLineMode,
    allToCardMode,
    toggleLineMode,

    // Compact and expanded modes
    expandedNodes,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    isNodeExpanded,
  };
}
