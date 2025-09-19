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

export const recalculateAllCodes = (argumentTree) => {
  const newCodes = {};

  const traverse = (node, parentCode = "") => {
    if (node.id !== "root") {
      // Trouver les frères du même parent
      const parent = findParentDirect(argumentTree, node.id);
      if (parent) {
        const sameTypeSiblings = parent.children.filter(
          (sibling) => sibling.causa === node.causa
        );
        const index = sameTypeSiblings.findIndex(
          (sibling) => sibling.id === node.id
        );

        const typeLetter =
          node.causa === "pro" ? "P" : node.causa === "contra" ? "C" : "N";

        const code = parentCode + `${typeLetter}${index + 1}`;
        newCodes[node.id] = code;
        parentCode = code.toLowerCase();
      }
    }

    node.children.forEach((child) => traverse(child, parentCode));
  };

  traverse(argumentTree);
  return newCodes;
};

// Helper function pour trouver le parent directement
const findParentDirect = (root, targetId) => {
  const stack = [{ node: root, parent: null }];

  while (stack.length > 0) {
    const { node, parent } = stack.pop();

    if (node.id === targetId) {
      return parent;
    }

    if (node.children) {
      for (const child of node.children) {
        stack.push({ node: child, parent: node });
      }
    }
  }

  return null;
};

export const getArgumentCode = (argumentCodes, targetNodeId) => {
  return argumentCodes[targetNodeId] || "";
};
