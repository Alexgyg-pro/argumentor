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
