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
    if (node.causa === "contra") {
      nodeScore = -nodeScore; // ← Score négatif pour les arguments contra
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
