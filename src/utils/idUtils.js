// src/utils/idUtils.js
/**
 * Compteurs globaux (simples et efficaces)
 */
const counters = {
  arg: 0,
  def: 0,
  ref: 0,
};

/**
 * Initialise les compteurs à partir d'items existants
 * (UNIQUEMENT nécessaire à l'import, pas à la création)
 */
export function initializeCountersFromItems(items = [], prefix) {
  let maxNumber = 0;

  for (const item of items) {
    if (item.id && item.id.startsWith(prefix)) {
      const match = item.id.match(new RegExp(`^${prefix}(\\d+)`));
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    }
  }

  counters[prefix] = maxNumber;
  return maxNumber;
}

/**
 * Réinitialise TOUS les compteurs à zéro
 * (Pour un nouvel argumentaire)
 */
export function resetAllCounters() {
  counters.arg = 0;
  counters.def = 0;
  counters.ref = 0;
}

/**
 * Réinitialise un compteur spécifique
 */
export function resetCounter(prefix) {
  counters[prefix] = 0;
}

/**
 * Génère le prochain ID
 */
export function getNextId(prefix) {
  counters[prefix] += 1;
  return `${prefix}${String(counters[prefix]).padStart(5, "0")}`;
}

/**
 * Définit manuellement un compteur (pour tests/debug)
 */
export function setCounter(prefix, value) {
  counters[prefix] = value;
}

/**
 * Récupère la valeur actuelle
 */
export function getCounter(prefix) {
  return counters[prefix];
}

/**
 * Formate un nombre en ID
 */
export function formatId(number, prefix) {
  return `${prefix}${String(number).padStart(5, "0")}`;
}
