import { useState } from "react";

export function ReferencesManager({
  references,
  onAddReference,
  onUpdateReference,
  onDeleteReference,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingReference) {
      // MODIFICATION
      onUpdateReference(editingReference.id, { title, content });
    } else {
      // AJOUT
      onAddReference({ title, content });
    }

    // Reset et fermeture
    setTitle("");
    setContent("");
    setEditingReference(null);
    setIsModalOpen(false);
  };

  const handleEdit = (reference) => {
    setEditingReference(reference);
    setTitle(reference.title);
    setContent(reference.content);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setEditingReference(null);
    setIsModalOpen(false);
  };

  return (
    <div className="references-manager">
      <div className="references-header">
        <h3>Références ({references.length})</h3>
        <button onClick={() => setIsModalOpen(true)}>
          + Nouvelle référence
        </button>
      </div>

      <div className="references-list">
        {references.map((ref) => (
          <div key={ref.id} className="reference-item">
            <div className="reference-title">{ref.title}</div>
            <div className="reference-actions">
              <button onClick={() => handleEdit(ref)}>✏️</button>
              <button onClick={() => onDeleteReference(ref.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALE D'ÉDITION */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingReference ? "Modifier" : "Nouvelle"} référence</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Titre :
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre court et clair"
                  required
                />
              </label>
              <label>
                Contenu :
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu détaillé de la référence..."
                  rows={6}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit">
                  {editingReference ? "Modifier" : "Ajouter"}
                </button>
                <button type="button" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
