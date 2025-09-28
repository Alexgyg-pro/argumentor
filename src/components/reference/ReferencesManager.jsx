import { useState } from "react";
import styles from "../EditingScreen.module.css";

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

  const handleNewReference = () => {
    setEditingReference(null);
    setTitle("");
    setContent("");
    setIsModalOpen(true);
  };

  return (
    <div className={styles.referencesManager}>
      {/* En-tête */}
      <div className={styles.referencesHeader}>
        <h3>Références ({references.length})</h3>
        <button
          onClick={handleNewReference}
          className={styles.addReferenceButton}
        >
          📚 Nouvelle référence
        </button>
      </div>

      {/* Liste des références */}
      <div className={styles.referencesList}>
        {references.map((ref) => (
          <div key={ref.id} className={styles.referenceItem}>
            <div className={styles.referenceTitle}>{ref.title}</div>
            <div className={styles.referenceActions}>
              <button onClick={() => handleEdit(ref)}>✏️</button>
              <button onClick={() => onDeleteReference(ref.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALE STYLÉE */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {editingReference
                ? "Modifier la référence"
                : "Nouvelle référence"}
            </h3>
            <form onSubmit={handleSubmit} className={styles.referenceForm}>
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
              <div className={styles.formActions}>
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
