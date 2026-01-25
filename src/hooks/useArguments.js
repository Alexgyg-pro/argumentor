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
    },
  );
  const [lineMode, setLineMode] = useState(new Set());
  const [expandedNodes, setExpandedNodes] = useState(new Set(["root"]));
  const [expandedParents, setExpandedParents] = useState(new Set()); // Parents dont on voit les enfants

  const [argumentCodes, setArgumentCodes] = useState({});

  // Recalculer les codes quand l'arbre change
  useEffect(() => {
    console.log("🔄 useEffect - Recalcul des codes et couleurs");
    if (argumentTree) {
      console.log(
        "🌳 argumentTree reçu:",
        JSON.stringify(argumentTree, null, 2),
      );
      const codes = recalculateCodesAndColors(
        argumentTree,
        findParentById,
        true, // parentEstPourTheseDefault
      );
      console.log("🎨 Codes recalculés:", Object.keys(codes).length);
      Object.entries(codes).forEach(([id, data]) => {
        const arg = findArgumentById(argumentTree, id);
        console.log(`  ${id}: ${data.code} (causa dans arbre: ${arg?.causa})`);
      });
      setArgumentCodes(codes);
    }
  }, [argumentTree]);

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

      console.log("🔄 MOVE_ARGUMENT - VERSION transformInTree");

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

      console.log("🎯 État initial dans treeCopy:", {
        argument: argument.id,
        argumentCausa: argument.causa,
        child: argument.children?.[0]?.id,
        childCausa: argument.children?.[0]?.causa,
      });

      // 3. Fonction qui modifie DIRECTEMENT dans treeCopy
      const transformInTree = (nodeId) => {
        const node = findInCopy(treeCopy, nodeId);
        if (node) {
          console.log(`🔶 ${nodeId}: ${node.causa} → neutralis`);
          node.causa = "neutralis";
          if (node.children) {
            node.children.forEach((child) => {
              console.log(`  ↳ Transformation de l'enfant: ${child.id}`);
              transformInTree(child.id);
            });
          }
        }
      };

      // 4. Appliquer la transformation
      transformInTree(argumentId);

      // 5. Vérification IMMÉDIATE dans treeCopy
      console.log("🔍 Vérification dans treeCopy après transformation:");
      const checkArg = findInCopy(treeCopy, argumentId);
      if (checkArg) {
        console.log(`  ${checkArg.id}: ${checkArg.causa}`);
        if (checkArg.children) {
          checkArg.children.forEach((child) => {
            console.log(`  ${child.id}: ${child.causa}`);
          });
        }
      }

      // 6. Retirer de l'ancien parent
      oldParent.children = oldParent.children.filter(
        (child) => child.id !== argumentId,
      );

      // 7. Mettre à jour le parentId
      argument.parentId = newParentId;

      // 8. Ajouter au nouveau parent
      newParent.children = newParent.children || [];
      newParent.children.push(argument);

      // 9. Vérification FINALE dans treeCopy
      console.log("✅ État final dans treeCopy:");
      const finalArg = findInCopy(treeCopy, argumentId);
      if (finalArg) {
        console.log(
          `  ${finalArg.id}: ${finalArg.causa}, parent: ${finalArg.parentId}`,
        );
        if (finalArg.children) {
          finalArg.children.forEach((child) => {
            console.log(`  ${child.id}: ${child.causa}`);
          });
        }
      }

      // 10. DEBUG : Afficher tout l'arbre pour vérifier
      console.log("🌳 treeCopy complet:", JSON.stringify(treeCopy, null, 2));

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
    console.log("🔄 setArguments appelé");
    if (newTree) {
      const allArgs = extractAllArguments(newTree);
      console.log(
        "📊 Arguments dans nouvel arbre:",
        allArgs.map((a) => a.id),
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

  // Toggle un nœud spécifique
  const toggleNodeExpansion = useCallback(
    (nodeId) => {
      console.log("🔘 toggleNodeExpansion appelé pour:", nodeId);
      console.log("   expandedNodes avant:", Array.from(expandedNodes));
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
          console.log("   → Supprimé", nodeId);
        } else {
          next.add(nodeId);
          console.log("   → Ajouté", nodeId);
        }
        console.log("   expandedNodes après:", Array.from(next));
        return next;
      });
    },
    [expandedNodes],
  );

  const expandAllNodes = useCallback(() => {
    console.log("🔘 expandAllNodes appelé");
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
    console.log("   → IDs à développer:", Array.from(allIds));
    setExpandedNodes(allIds);
  }, [argumentTree]);

  const collapseAllNodes = useCallback(() => {
    console.log("🔘 collapseAllNodes appelé");
    console.log("   → Réinitialisation à ['root']");
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

    // Compact and expanded modes
    expandedNodes,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    isNodeExpanded,
  };
}
