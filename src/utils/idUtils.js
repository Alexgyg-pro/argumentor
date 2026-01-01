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
// export function initializeCountersFromItems(items = [], prefix) {
//   console.log(`🔢 Initialisation des compteurs pour préfixe "${prefix}"`);
//   console.log(
//     "📋 Items reçus:",
//     items.map((item) => item.id)
//   );
//   let maxNumber = 0;

//   for (const item of items) {
//     if (item.id && item.id.startsWith(prefix)) {
//       const match = item.id.match(new RegExp(`^${prefix}(\\d+)`));
//       if (match) {
//         const num = parseInt(match[1], 10);
//         if (num > maxNumber) maxNumber = num;
//       }
//     }
//   }

//   counters[prefix] = maxNumber;
//   return maxNumber;
// }

// Dans idUtils.js, modifie initializeCountersFromItems :
export function initializeCountersFromItems(items = [], prefix) {
  // console.log(`🔢 [INIT] Initialisation compteur ${prefix}`);
  // console.log(
  //   `📋 [INIT] Items (${items.length}):`,
  //   items.map((i) => i.id)
  // );

  let maxNumber = 0;
  let detected = 0;

  for (const item of items) {
    if (item.id && item.id.startsWith(prefix)) {
      // console.log(`   ✓ ${item.id} commence par ${prefix}`);
      const match = item.id.match(new RegExp(`^${prefix}(\\d+)`));
      // console.log(`     match:`, match);
      if (match) {
        const num = parseInt(match[1], 10);
        detected++;
        // console.log(`     → num: ${num} (maxNumber: ${maxNumber})`);
        if (num > maxNumber) maxNumber = num;
      }
    } else {
      // console.log(`   ✗ ${item.id} NE commence PAS par ${prefix}`);
    }
  }

  counters[prefix] = maxNumber;
  // console.log(
  //   `✅ [INIT] Compteur ${prefix} = ${maxNumber} (détecté ${detected}/${items.length} items)`
  // );
  // console.log(`📊 [INIT] État des compteurs:`, { ...counters });
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
