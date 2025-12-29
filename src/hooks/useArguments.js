// src/hooks/useArguments.js

import { useState, useCallback, useEffect } from "react";
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
    }
  );
  const [lineMode, setLineMode] = useState(new Set());
  const [expandedParents, setExpandedParents] = useState(new Set()); // Parents dont on voit les enfants

  const [argumentCodes, setArgumentCodes] = useState({});

  // Recalculer les codes quand l'arbre change
  useEffect(() => {
    if (argumentTree) {
      const codes = recalculateCodesAndColors(
        argumentTree,
        findParentById,
        true // parentEstPourTheseDefault
      );
      setArgumentCodes(codes);
    }
  }, [argumentTree]);

  const getArgumentCode = useCallback(
    (argumentId) => {
      return argumentCodes[argumentId]?.code || `#${argumentId}`;
    },
    [argumentCodes]
  );

  // Fonction pour obtenir la couleur d'un argument
  const getArgumentColor = useCallback(
    (argumentId) => {
      return argumentCodes[argumentId]?.color || "gray";
    },
    [argumentCodes]
  );

  const addArgument = useCallback(
    (parentId, data) => {
      console.log("➕ addArgument appelé");
      console.log("📊 Compteur arg avant:", getCounter("arg"));

      const newId = getNextId("arg"); // Générer l'ID une seule fois
      console.log("🆔 Nouvel ID généré:", newId);

      const newArg = {
        id: newId, // Utiliser l'ID généré
        parentId,
        claim: data.claim || "",
        claimComment: data.claimComment || "",
        causa: data.causa || "neutralis",
        forma: data.forma || "descriptif",
        natura: data.natura || "validity",
        validity: data.validity ?? 0.5,
        relevance: data.relevance ?? 0.5,
        value: data.value ?? 0.5,
        weight: data.weight ?? 0.5,
        references: data.references || [],
        children: [],
      };

      console.log("📊 Compteur arg après:", getCounter("arg"));

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
    [argumentTree]
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
    [argumentTree]
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
    [argumentTree]
  );

  const moveArgument = useCallback(
    (argumentId, newParentId) => {
      if (!argumentTree) return;

      // Trouver les acteurs
      const argument = findArgumentById(argumentTree, argumentId);
      const oldParent = findArgumentById(argumentTree, argument?.parentId);
      const newParent = findArgumentById(argumentTree, newParentId);

      if (!argument || !oldParent || !newParent) {
        console.error(
          "Impossible de trouver un des éléments pour le déplacement"
        );
        return;
      }

      // Créer une copie de l'arbre
      const newTree = JSON.parse(JSON.stringify(argumentTree));

      // Fonction helper pour trouver et modifier un nœud
      const modifyNode = (node, nodeId, modifier) => {
        if (node.id === nodeId) {
          return modifier(node);
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map((child) =>
              modifyNode(child, nodeId, modifier)
            ),
          };
        }
        return node;
      };

      // 1. Retirer de l'ancien parent
      const treeAfterRemoval = modifyNode(newTree, oldParent.id, (parent) => ({
        ...parent,
        children: parent.children.filter((child) => child.id !== argumentId),
      }));

      // 2. Ajouter au nouveau parent
      const treeAfterAddition = modifyNode(
        treeAfterRemoval,
        newParent.id,
        (parent) => ({
          ...parent,
          children: [
            ...parent.children,
            { ...argument, parentId: newParentId },
          ],
        })
      );

      // 3. Mettre à jour le parentId de l'argument
      const finalTree = modifyNode(treeAfterAddition, argumentId, (arg) => ({
        ...arg,
        parentId: newParentId,
      }));

      setArgumentTree(finalTree);
    },
    [argumentTree]
  );

  const getPossibleParents = useCallback(
    (argumentId) => {
      return getPossibleNewParents(argumentTree, argumentId);
    },
    [argumentTree]
  );

  const importArguments = useCallback((importedTree) => {
    console.log("📥 IMPORT - Initialisation des compteurs");
    const allArgs = extractAllArguments(importedTree);
    console.log(
      "📊 Arguments détectés:",
      allArgs.map((a) => a.id)
    );
    initializeCountersFromItems(allArgs, "arg");
    setArgumentTree(importedTree);
  }, []);

  const resetArguments = useCallback(() => {
    console.log("🔄 resetArguments - Réinitialisation complète");
    resetCounter("arg");
    setArgumentTree(null);
  }, []);

  const setArguments = useCallback((newTree) => {
    console.log("🔄 setArguments appelé");
    if (newTree) {
      const allArgs = extractAllArguments(newTree);
      console.log(
        "📊 Arguments dans nouvel arbre:",
        allArgs.map((a) => a.id)
      );
      initializeCountersFromItems(allArgs, "arg");
    } else {
      console.log("🔄 Réinitialisation du compteur arg (arbre null)");
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
    console.log("🔄 toggleLineMode pour:", argumentId);
    setLineMode((prev) => {
      const next = new Set(prev);
      if (next.has(argumentId)) {
        next.delete(argumentId);
        console.log("  -> Supprimé, maintenant", next.size, "en ligne");
      } else {
        next.add(argumentId);
        console.log("  -> Ajouté, maintenant", next.size, "en ligne");
      }
      return next;
    });
  }, []);

  return {
    // État
    argumentTree,
    argumentCodes,

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
    setArguments: setArgumentTree,

    // Line/Card-mode
    lineMode,
    allToLineMode,
    allToCardMode,
    toggleLineMode,
  };
}
