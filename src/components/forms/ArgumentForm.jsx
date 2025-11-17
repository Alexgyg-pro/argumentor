// src/components/forms/ArgumentForm.jsx
import { useState, useEffect } from "react";

export function ArgumentForm({ parentId, initialData = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    claim: initialData.claim || "",
    claimComment: initialData.claimComment || "",
    causa: initialData.causa || "neutralis",
    forma: initialData.forma || "descriptif",
    natura: initialData.natura || "validity",
    validity: initialData.validity !== undefined ? initialData.validity : 0.5,
    relevance:
      initialData.relevance !== undefined ? initialData.relevance : 0.5,
    value: initialData.value !== undefined ? initialData.value : 0.5,
    weight: initialData.weight !== undefined ? initialData.weight : 0.5,
    references: initialData.references || [],
  }));

  // Pré-remplir avec les données existantes en mode modification
  // useEffect(() => {
  //   if (initialData) {
  //     setFormData({
  //       claim: initialData.claim || "",
  //       claimComment: initialData.claimComment || "",
  //       causa: initialData.causa || "neutralis",
  //       forma: initialData.forma || "descriptif",
  //       natura: initialData.natura || "validity",
  //       validity:
  //         initialData.validity !== undefined ? initialData.validity : 0.5,
  //       relevance:
  //         initialData.relevance !== undefined ? initialData.relevance : 0.5,
  //       value: initialData.value !== undefined ? initialData.value : 0.5,
  //       weight: initialData.weight !== undefined ? initialData.weight : 0.5,
  //       references: initialData.references || [],
  //     });
  //   }
  // }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      parentId: parentId,
    });
  };

  const handleReferenceChange = (index, value) => {
    const newReferences = [...formData.references];
    newReferences[index] = value;
    setFormData({ ...formData, references: newReferences });
  };

  const addReference = () => {
    setFormData({
      ...formData,
      references: [...formData.references, ""],
    });
  };

  const removeReference = (index) => {
    const newReferences = formData.references.filter((_, i) => i !== index);
    setFormData({ ...formData, references: newReferences });
  };

  return (
    <form onSubmit={handleSubmit} className="argument-form">
      <div className="form-group">
        <label htmlFor="claim">Argument :</label>
        <input
          id="claim"
          type="text"
          value={formData.claim}
          onChange={(e) => setFormData({ ...formData, claim: e.target.value })}
          placeholder="Votre argument..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="claimComment">Commentaire sur l'argument :</label>
        <textarea
          id="claimComment"
          value={formData.claimComment}
          onChange={(e) =>
            setFormData({ ...formData, claimComment: e.target.value })
          }
          placeholder="Commentaire ou explication de l'argument..."
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="causa">Causa :</label>
          <select
            id="causa"
            value={formData.causa}
            onChange={(e) =>
              setFormData({ ...formData, causa: e.target.value })
            }
          >
            <option value="pro">Pro</option>
            <option value="contra">Contra</option>
            <option value="neutralis">Neutralis</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="forma">Forma :</label>
          <select
            id="forma"
            value={formData.forma}
            onChange={(e) =>
              setFormData({ ...formData, forma: e.target.value })
            }
          >
            <option value="descriptif">Descriptif</option>
            <option value="normatif">Normatif</option>
            <option value="esthetique">Esthétique</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="natura">Natura :</label>
          <select
            id="natura"
            value={formData.natura}
            onChange={(e) =>
              setFormData({ ...formData, natura: e.target.value })
            }
          >
            <option value="validity">Validité</option>
            <option value="relevance">Pertinence</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="validity">Validité : {formData.validity}</label>
          <input
            id="validity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.validity}
            onChange={(e) =>
              setFormData({ ...formData, validity: parseFloat(e.target.value) })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="relevance">Pertinence : {formData.relevance}</label>
          <input
            id="relevance"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.relevance}
            onChange={(e) =>
              setFormData({
                ...formData,
                relevance: parseFloat(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="value">Valeur : {formData.value}</label>
          <input
            id="value"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: parseFloat(e.target.value) })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Poids : {formData.weight}</label>
          <input
            id="weight"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>Références :</label>
        {formData.references.map((reference, index) => (
          <div key={index} className="reference-item">
            <input
              type="text"
              value={reference}
              onChange={(e) => handleReferenceChange(index, e.target.value)}
              placeholder="Référence..."
            />
            <button type="button" onClick={() => removeReference(index)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={addReference}>
          + Ajouter une référence
        </button>
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
