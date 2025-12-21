// src/utils/argumentUtils.js
export function findArgumentById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (let child of node.children) {
      const found = findArgumentById(child, id);
      if (found) return found;
    }
  }
  return null;
}

export function getNextArgumentId(tree) {
  return `arg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getPossibleNewParents(tree, argumentId) {
  if (!tree) return [];

  const argument = findArgumentById(tree, argumentId);
  const excludedIds = new Set([argumentId]);

  if (argument && argument.children) {
    const collectDescendants = (node) => {
      if (node.children) {
        node.children.forEach((child) => {
          excludedIds.add(child.id);
          collectDescendants(child);
        });
      }
    };
    collectDescendants(argument);
  }

  const possibleParents = [];
  const collectParents = (node) => {
    if (!excludedIds.has(node.id)) {
      possibleParents.push({
        id: node.id,
        claim: node.claim,
        isRoot: node.id === tree.id,
      });
    }

    if (node.children) {
      node.children.forEach((child) => collectParents(child));
    }
  };

  collectParents(tree);
  return possibleParents;
}

// src/utils/argumentOperations.js
// import { findArgumentById } from "./argumentUtils";

/**
 * Génère un dictionnaire de codes et couleurs pour chaque nœud de l'arbre.
 */
export const recalculateCodesAndColors = (
  argumentTree,
  findParentById,
  parentEstPourTheseDefault = true
) => {
  const result = {};

  if (!argumentTree || !argumentTree.children) return {};

  const calculateForNode = (
    node,
    parentCode = "",
    parentColor = "blue",
    parentEstPourThese = parentEstPourTheseDefault
  ) => {
    if (node.id === "root") return;

    const parent = findParentById(argumentTree, node.id);
    const siblings = parent?.children || [];

    const sameTypeSiblings = siblings.filter(
      (sibling) => sibling.causa === node.causa
    );
    const index = sameTypeSiblings.findIndex(
      (sibling) => sibling.id === node.id
    );

    const segment = `${
      node.causa === "pro" ? "P" : node.causa === "contra" ? "C" : "N"
    }${index + 1}`;
    const code = parentCode.toLowerCase() + segment;

    // 🎯 CALCULER estPourThese ET color
    let estPourThese = parentEstPourThese;
    let color = parentColor;

    if (node.causa === "contra") {
      estPourThese = !parentEstPourThese; // Inverse la position
      color = parentColor === "blue" ? "red" : "blue";
    } else if (node.causa === "neutralis") {
      color = "gray";
      // estPourThese garde la valeur du parent
    }
    // Pour "pro": estPourThese et color gardent les valeurs du parent

    // 🎯 MAINTENANT estPourThese EST DÉFINI
    result[node.id] = { code, color, estPourThese };

    // 🎯 PROPAGER LA BONNE VALEUR AUX ENFANTS
    node.children?.forEach((child) =>
      calculateForNode(child, code, color, estPourThese)
    );
  };

  argumentTree.children.forEach((child) =>
    calculateForNode(child, "", "blue", parentEstPourTheseDefault)
  );

  return result;
};

/**
 * Trouve le parent d'un nœud (fonction helper)
 */
export const findParentById = (tree, nodeId) => {
  const findParentRecursive = (currentNode, targetId) => {
    if (currentNode.children) {
      for (const child of currentNode.children) {
        if (child.id === targetId) {
          return currentNode;
        }
        const found = findParentRecursive(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  return findParentRecursive(tree, nodeId);
};
