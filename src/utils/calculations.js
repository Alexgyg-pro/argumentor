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

// export const recalculateAllCodes = (argumentTree, findParentById) => {
//   console.log("🌳 ArgumentTree:", argumentTree); // ← Structure de l'arbre
//   const newCodes = {};

//   const calculateCodeForNode = (node, parentCode = "") => {
//     console.log("🔍 Processing node:", node.id); // ← Si ça s'affiche
//     if (node.id === "root") return;

//     const parent = findParentById(argumentTree, node.id);
//     console.log("🔍 Parent for", node.id, ":", parent);
//     const allSiblings = parent?.children || [];

//     console.log("🐛 Node:", node.id, "causa:", node.causa);
//     console.log("🐛 Parent:", parent?.id);
//     console.log(
//       "🐛 All siblings:",
//       allSiblings.map((s) => ({ id: s.id, causa: s.causa }))
//     );

//     const siblingsSameType = allSiblings.filter((s) => s.causa === node.causa);
//     console.log(
//       "🐛 Siblings same type:",
//       siblingsSameType.map((s) => s.id)
//     );

//     const index = siblingsSameType.findIndex(
//       (sibling) => sibling.id === node.id
//     );
//     console.log("🐛 Index in same type:", index);

//     const position = index + 1;
//     const segment =
//       node.causa === "neutralis"
//         ? `N${position}`
//         : node.causa === "pro"
//         ? `P${position}`
//         : `C${position}`;

//     console.log("🐛 Segment:", segment);

//     const code = parentCode + segment;
//     newCodes[node.id] = code;
//     console.log("🐛 Final code:", code);

//     if (node.children) {
//       node.children.forEach((child) =>
//         calculateCodeForNode(child, code.toLowerCase())
//       );
//     }

//     // node.children.forEach((child) =>
//     //   calculateCodeForNode(child, code.toLowerCase())
//     // );
//   };

//   if (argumentTree.children) {
//     console.log("👶 Children count:", argumentTree.children.length);
//     argumentTree.children.forEach((child) => {
//       console.log("🧒 Starting with child:", child.id);
//       calculateCodeForNode(child, "");
//     });
//   } else {
//     console.log("❌ No children in argumentTree");
//   }
//   return newCodes;
// };

export const recalculateAllCodes = (argumentTree, findParentById) => {
  const newCodes = {};

  const calculateCodeForNode = (node, parentCode = "") => {
    if (node.id === "root") return;

    const parent = findParentById(argumentTree, node.id);
    const allSiblings = parent?.children || [];

    // NOUVELLE LOGIQUE DE COMPTAGE :
    let sameTypeCount = 0;
    for (let i = 0; i < allSiblings.length; i++) {
      if (allSiblings[i].id === node.id) break;
      if (allSiblings[i].causa === node.causa) sameTypeCount++;
    }
    const position = sameTypeCount + 1;

    const segment =
      node.causa === "neutralis"
        ? `N${position}`
        : node.causa === "pro"
        ? `P${position}`
        : `C${position}`;

    const code = parentCode + segment;
    newCodes[node.id] = code;

    if (node.children) {
      node.children.forEach((child) =>
        calculateCodeForNode(child, code.toLowerCase())
      );
    }
  };

  if (argumentTree.children) {
    argumentTree.children.forEach((child) => calculateCodeForNode(child, ""));
  }

  return newCodes;
};

export const getArgumentCode = (argumentCodes, targetNodeId) => {
  return argumentCodes[targetNodeId] || "";
};
