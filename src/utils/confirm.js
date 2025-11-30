// src/utils/confirm.js

/**
 * Messages de confirmation prédéfinis
 */
export const CONFIRM_MESSAGES = {
  UNSAVED_CHANGES:
    "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir continuer ? Votre travail en cours sera perdu.",
  DELETE_ITEM: "Êtes-vous sûr de vouloir supprimer cet élément ?",
  // ... autres messages ...
};

/**
 * Demande confirmation conditionnelle
 * @param {boolean} condition - Condition pour déclencher la confirmation
 * @param {string} message - Message de confirmation
 * @returns {boolean} true si l'action peut continuer, false sinon
 */
export const confirmIf = (
  condition,
  message = CONFIRM_MESSAGES.UNSAVED_CHANGES
) => {
  if (condition) {
    return window.confirm(message);
  }
  return true;
};

// Alias pour la confirmation de modifications non sauvegardées
export const confirmIfDirty = (isDirty, customMessage = null) =>
  confirmIf(isDirty, customMessage || CONFIRM_MESSAGES.UNSAVED_CHANGES);
