import { useState, useEffect } from "react";
import { Form, FormField, FormActions } from "./Forms";

export function DefinitionForm({ onSubmit, onCancel, initialData }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");

  useEffect(() => {
    if (initialData) {
      setTerm(initialData.term || "");
      setDefinition(initialData.definition || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!term.trim() || !definition.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    onSubmit({
      term: term.trim(),
      definition: definition.trim(),
    });

    // Réinitialiser seulement si pas en mode édition
    if (!initialData) {
      setTerm("");
      setDefinition("");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Terme" required>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Terme à définir"
          required
          autoFocus
        />
      </FormField>

      <FormField label="Définition" required>
        <textarea
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Définition claire et concise..."
          rows={6}
          required
        />
      </FormField>

      <FormActions>
        <button type="submit" className="primary">
          {initialData ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      </FormActions>
    </Form>
  );
}
