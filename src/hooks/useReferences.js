// src/hooks/useReferences.js
import { useState } from "react";
import { getNextReferenceId } from "../utils/referenceUtils";

export function useReferences(initialReferences = []) {
  const [references, setReferences] = useState(initialReferences);

  const addReference = (reference) => {
    const newReference = {
      id: getNextReferenceId(references),
      title: reference.title,
      content: reference.content || "",
    };
    setReferences((prev) => [...prev, newReference]);
    return newReference.id;
  };

  const updateReference = (id, updatedReference) => {
    setReferences((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, ...updatedReference } : ref))
    );
  };

  const deleteReference = (id) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
  };

  const importReferences = (importedReferences = []) => {
    // ⭐ IMPORTANT : Garder les IDs originaux lors de l'import
    setReferences(importedReferences);
  };

  const resetReferences = () => {
    setReferences([]);
  };

  return {
    references,
    addReference,
    updateReference,
    deleteReference,
    importReferences,
    resetReferences,
  };
}
