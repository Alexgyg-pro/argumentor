// src/hooks/useArguments.js
import { useState, useCallback } from "react";
import {
  findArgumentById,
  getNextArgumentId,
  getPossibleNewParents,
} from "../utils/argumentUtils";

export function useArguments(initialArgumentTree = null) {
  const [argumentTree, setArgumentTree] = useState(
    initialArgumentTree || {
      id: "root",
      claim: "",
      children: [],
    }
  );

  const addArgument = useCallback(
    (parentId, data) => {
      const newArg = {
        id: getNextArgumentId(argumentTree),
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
    setArgumentTree(importedTree);
  }, []);

  const resetArguments = useCallback(() => {
    setArgumentTree(null);
  }, []);

  const setArguments = useCallback((newTree) => {
    setArgumentTree(newTree);
  }, []);

  return {
    // État
    argumentTree,

    // Fonctions CRUD
    addArgument,
    updateArgument,
    deleteArgument,
    moveArgument,

    // Fonctions utilitaires
    getPossibleParents,
    findArgumentById: (id) => findArgumentById(argumentTree, id),

    // Import/export
    importArguments,
    resetArguments,
    setArguments,
  };
}
