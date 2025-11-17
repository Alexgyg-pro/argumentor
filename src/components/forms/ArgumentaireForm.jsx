// src/components/forms/ArgumentaireForm.jsx
import { useState, useEffect } from "react";

export function ArgumentaireForm({ initialData = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    thesis: "",
    context: "",
    forma: "Descriptif",
  });

  // Pré-remplir avec les données existantes en mode modification
  useEffect(() => {
    if (initialData) {
      setFormData({
        thesis: initialData.thesis || "",
        context: initialData.context || "",
        forma: initialData.forma || "Descriptif",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="argumentaire-form">
      <div className="form-group">
        <label htmlFor="thesis">Thèse principale :</label>
        <input
          id="thesis"
          type="text"
          value={formData.thesis}
          onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
          placeholder="Votre thèse principale..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="context">Contexte :</label>
        <textarea
          id="context"
          value={formData.context}
          onChange={(e) =>
            setFormData({ ...formData, context: e.target.value })
          }
          placeholder="Contexte de l'argumentaire..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="forma">Forma :</label>
        <select
          id="forma"
          value={formData.forma}
          onChange={(e) => setFormData({ ...formData, forma: e.target.value })}
        >
          <option value="Descriptif">Descriptif</option>
          <option value="Normatif">Normatif</option>
          <option value="Esthétique">Esthétique</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">Valider</button>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
