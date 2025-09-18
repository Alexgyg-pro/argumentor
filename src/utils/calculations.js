// SUPPRIMER useCallback et les dépendances
// Faire une fonction PURE avec paramètres

export const calculateGlobalScore = (argumentTree, thesisForma) => {
  // Fonction récursive interne
  const calculate = (node, forma) => {
    if (node.id === "root") {
      if (!node.children || node.children.length === 0) return 0.5;
      const childScores = node.children.map((child) => calculate(child, forma));
      return (
        childScores.reduce((sum, score) => sum + score, 0) / childScores.length
      );
    }

    let nodeScore = (node.validity ?? 0.5) * (node.relevance ?? 0.5);
    if (node.causa === "pro") {
      nodeScore = +Math.abs(nodeScore); // Positif
    } else if (node.causa === "contra") {
      nodeScore = -Math.abs(nodeScore); // Négatif
    } else {
      nodeScore = 0; // Neutre = aucun impact
    }
    if (!node.children || node.children.length === 0) return nodeScore;

    const childScores = node.children.map((child) => calculate(child, forma));
    const averageChildScore =
      childScores.reduce((sum, score) => sum + score, 0) / childScores.length;

    return forma === "descriptif"
      ? nodeScore * 0.6 + averageChildScore * 0.4
      : nodeScore * 0.4 + averageChildScore * 0.6;
  };

  return calculate(argumentTree, thesisForma);
};

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
