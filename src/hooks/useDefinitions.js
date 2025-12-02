import { useState, useCallback } from "react";
import { getNextDefinitionId } from "../utils/definitionUtils";

export function useDefinitions(initialDefinitions = []) {
  const [definitions, setDefinitions] = useState(initialDefinitions);

  const addDefinition = useCallback(
    (definition) => {
      const newDefinition = {
        id: getNextDefinitionId(definitions),
        term: definition.term,
        definition: definition.definition || "",
      };
      setDefinitions((prev) => [...prev, newDefinition]);
      return newDefinition.id;
    },
    [definitions]
  );

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
    setDefinitions(importedDefinitions);
  }, []);

  const resetDefinitions = useCallback(() => {
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
