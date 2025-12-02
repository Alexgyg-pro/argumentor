// src/components/forms/DefinitionForm.jsx
import { useState } from "react";
import { Form, FormField, FormActions } from "./Forms";

export function DefinitionForm(handleSubmit) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [editingDefinition, setEditingDefinition] = useState(null);
  const handleCancel = () => {
    // Logique pour annuler l'édition ou la création
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
        <button type="submit">
          {editingDefinition ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={handleCancel}>
          Annuler
        </button>
      </FormActions>
    </Form>
  );
}
