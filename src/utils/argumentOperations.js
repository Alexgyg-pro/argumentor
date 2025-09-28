// Fonctions pures pour manipuler l'arbre
export const findNodeById = (node, targetId) => {
  if (node.id === targetId) return node;
  for (const child of node.children) {
    const found = findNodeById(child, targetId);
    if (found) return found;
  }
  return null;
};

export const findParentById = (node, targetId, parent = null) => {
  if (node.id === targetId) return parent;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findParentById(child, targetId, node);
    if (found) return found;
  }
  return null;
};

export const deleteNodeRecursively = (node, targetId) => {
  if (node.id === targetId) return null;

  const newChildren = node.children
    .map((child) => deleteNodeRecursively(child, targetId))
    .filter((child) => child !== null);

  return { ...node, children: newChildren };
};

export const addChildToNode = (tree, parentId, newChild) => {
  const newTree = JSON.parse(JSON.stringify(tree));
  const parent = findNodeById(newTree, parentId);
  if (parent) {
    parent.children.push(newChild);
  }
  return newTree; // ← Retourner le nouvel arbre
};
