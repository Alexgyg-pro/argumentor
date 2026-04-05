// src/utils/scoreUtils.js

/**
 * Facteur d'échelle pour la courbe en S.
 * Plus il est grand, plus il faut d'arguments forts pour approcher les asymptotes.
 */
const GLOBAL_SCALE = 4;

/**
 * Courbe en S (tanh) centrée en zéro.
 * Entrée : valeur réelle non bornée
 * Sortie : valeur dans ]-1 ; +1[
 *
 * Exemples :
 *   sigmoid(0)   = 0
 *   sigmoid(1)   ≈ 0.76
 *   sigmoid(2)   ≈ 0.96
 *   sigmoid(-1)  ≈ -0.76
 */
export function sigmoid(x) {
  return Math.tanh(x);
}

/**
 * Calcule récursivement les scores de chaque nœud de l'arbre.
 *
 * Règles :
 *   - validity(N)  = Σ value(enfant pro-validity)  − Σ value(enfant contra-validity)
 *   - relevance(N) = Σ value(enfant pro-relevance) − Σ value(enfant contra-relevance)
 *   - weight(N)    = tanh(raw_validity + raw_relevance)  ∈ ]-1 ; +1[
 *
 * Pour un nœud feuille (aucun enfant contributeur) :
 *   - raw_validity = 0, raw_relevance = 0
 *   - weight = 2*value − 1  (mappage linéaire [0,1] → [-1,+1])
 *
 * @param {Object} node - Nœud de l'arbre
 * @returns {Object} Nœud enrichi avec rawValidity, rawRelevance, validity, relevance, weight
 */
export function computeScores(node) {
  if (!node) return null;

  const processedChildren = (node.children || []).map(computeScores);

  let rawValidity = 0;
  let rawRelevance = 0;
  let hasContributors = false;

  for (const child of processedChildren) {
    const sign =
      child.causa === "pro" ? 1 : child.causa === "contra" ? -1 : 0;

    if (sign !== 0) {
      hasContributors = true;
      if (child.natura === "validity") {
        rawValidity += sign * child.value;
      } else if (child.natura === "relevance") {
        rawRelevance += sign * child.value;
      }
    }
  }

  const validity = sigmoid(rawValidity);
  const relevance = sigmoid(rawRelevance);

  // Feuille sans enfants positionnés : le poids est directement la valeur utilisateur
  const weight = hasContributors
    ? sigmoid(rawValidity + rawRelevance)
    : (node.value ?? 0.5);

  return {
    ...node,
    children: processedChildren,
    rawValidity,
    rawRelevance,
    validity,
    relevance,
    weight,
  };
}

/**
 * Calcule le score global de l'argumentaire à partir du poids de tous les arguments.
 *
 * Chaque argument contribue positivement s'il est pro-thèse, négativement s'il est contra-thèse.
 * La courbe en S garantit les asymptotes à ±10.
 *
 * @param {Object} scoredTree - Arbre avec scores calculés (résultat de computeScores)
 * @param {Object} argumentCodes - Dictionnaire { id → { estPourThese } } (depuis recalculateCodesAndColors)
 * @returns {number|null} Score global ∈ ]-10 ; +10[, ou null si aucun argument positionné
 */
export function computeGlobalScore(scoredTree, argumentCodes) {
  if (!scoredTree || !scoredTree.children) return null;

  const args = [];

  const collectArgs = (node) => {
    if (node.id !== "root") args.push(node);
    (node.children || []).forEach(collectArgs);
  };

  collectArgs(scoredTree);

  const positioned = args.filter((a) => a.causa !== "neutralis");
  if (positioned.length === 0) return null;

  let rawScore = 0;
  for (const arg of positioned) {
    const info = argumentCodes[arg.id];
    // Si estPourThese n'est pas défini, on l'ignore
    if (!info) continue;
    const sign = info.estPourThese ? 1 : -1;
    rawScore += sign * arg.weight;
  }

  return 10 * sigmoid(rawScore / GLOBAL_SCALE);
}
