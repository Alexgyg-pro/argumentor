import { useState, useCallback } from "react";
import {
  getNextId,
  initializeCountersFromItems,
  resetCounter,
} from "../utils/idUtils";

export function useReferences(initialReferences = []) {
  const [references, setReferences] = useState(initialReferences);

  if (initialReferences.length > 0) {
    initializeCountersFromItems(initialReferences, "ref");
  }

  const addReference = useCallback((reference) => {
    const newReference = {
      id: getNextId("ref"),
      title: reference.title,
      content: reference.content || "",
    };

    setReferences((prev) => [...prev, newReference]);
    return newReference.id;
  }, []);

  const updateReference = useCallback((id, updatedReference) => {
    setReferences((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, ...updatedReference } : ref))
    );
  }, []);

  const deleteReference = useCallback((id) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
  }, []);

  const importReferences = useCallback((importedReferences = []) => {
    resetCounter("ref");
    if (importedReferences.length > 0) {
      initializeCountersFromItems(importedReferences, "ref");
    }
    setReferences(importedReferences);
  }, []);

  const resetReferences = useCallback(() => {
    resetCounter("ref");
    setReferences([]);
  }, []);

  return {
    references,
    addReference,
    updateReference,
    deleteReference,
    importReferences,
    resetReferences,
  };
}
