import { useState, useCallback } from "react";
import { getNextDefinitionId } from "../utils/definitionUtils";
import {
  getNextId,
  initializeCountersFromItems,
  resetCounter,
} from "../utils/idUtils";

export function useDefinitions(initialDefinitions = []) {
  const [definitions, setDefinitions] = useState(initialDefinitions);

  // Initialiser seulement si on a des données au démarrage
  if (initialDefinitions.length > 0) {
    initializeCountersFromItems(initialDefinitions, "def");
  }

  const addDefinition = useCallback((definition) => {
    const newDefinition = {
      id: getNextId("def"),
      term: definition.term,
      definition: definition.definition || "",
    };
    setDefinitions((prev) => [...prev, newDefinition]);
    return newDefinition.id;
  }, []);

  const updateDefinition = useCallback((id, updatedDefinition) => {
    setDefinitions((prev) =>
      prev.map((def) =>
        def.id === id ? { ...def, ...updatedDefinition } : def
      )
    );
  }, []);

  const deleteDefinition = useCallback((id) => {
    setDefinitions((prev) => prev.filter((def) => def.id !== id));
  }, []);

  const importDefinitions = useCallback((importedDefinitions = []) => {
    // Réinitialiser le compteur et le réinitialiser avec les données importées
    resetCounter("def");
    if (importedDefinitions.length > 0) {
      initializeCountersFromItems(importedDefinitions, "def");
    }
    setDefinitions(importedDefinitions);
  }, []);

  const resetDefinitions = useCallback(() => {
    resetCounter("def");
    setDefinitions([]);
  }, []);

  return {
    definitions,
    addDefinition,
    updateDefinition,
    deleteDefinition,
    importDefinitions,
    resetDefinitions,
  };
}
