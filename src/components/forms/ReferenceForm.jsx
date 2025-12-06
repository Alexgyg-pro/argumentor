// src/components/forms/ReferenceForm.jsx
import { useState, useEffect } from "react";
import { Form, FormField, FormActions } from "./Forms";

export function ReferenceForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
    });

    if (!initialData) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Titre" required>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la référence"
          required
          autoFocus
        />
      </FormField>

      <FormField label="Contenu" required>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenu de la référence (URL, citation, etc.)..."
          rows={6}
          required
        />
      </FormField>

      <FormActions>
        <button type="submit">{initialData ? "Modifier" : "Ajouter"}</button>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      </FormActions>
    </Form>
  );
}
