// src/components/references/ReferencesList.jsx
import { useState } from "react";
import { ReferenceForm } from "../forms/ReferenceForm";
import styles from "../screens/DisplayScreen.module.css";
import { ReferenceModal } from "../modals/referenceModal";
import {
  ReticleIcon,
  ReticleIcon2,
  TargetIcon,
  LinkIcon,
  RelevanceIcon,
  ArrowUpDownIcon,
  ArrowUpDownIcon2,
  ChevronUpDownIcon,
  ChevronUpDownIcon2,
  TrashIcon,
  EditIcon,
  PlusIcon,
} from "../common/Icons";

export function ReferencesList({
  references = [],
  onAddReference,
  onUpdateReference,
  onDeleteReference,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingReference, setEditingReference] = useState(null);

  const handleNewClick = () => {
    setEditingReference(null);
    setShowForm(true);
  };

  const handleEdit = (reference) => {
    setEditingReference(reference);
    setShowForm(true);
  };

  const handleSubmit = (referenceData) => {
    if (editingReference) {
      onUpdateReference(editingReference.id, referenceData);
    } else {
      onAddReference(referenceData);
    }
    setShowForm(false);
    setEditingReference(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReference(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette référence ?")) {
      onDeleteReference(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Références</h3>
        {!showForm && (
          <button onClick={handleNewClick} className={styles.addButton}>
            Ajouter une référence
          </button>
        )}
      </div>

      {showForm ? (
        <ReferenceModal
          isOpen={showForm}
          onClose={handleCancel}
          initialData={editingReference}
          onSave={handleSubmit}
        />
      ) : // <ReferenceForm
      //   onSubmit={handleSubmit}
      //   onCancel={handleCancel}
      //   initialData={editingReference}
      // />
      references.length === 0 ? (
        <p className={styles.emptyMessage}>Aucune référence pour le moment.</p>
      ) : (
        <div className={styles.list}>
          {references.map((ref) => (
            <div key={ref.id} className={styles.item}>
              <div className={styles.content}>
                <div className={styles.DefRefTitle}>{ref.title}</div>
                <div className={styles.DefRefContent}>{ref.content}</div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(ref)}
                  className={styles.editButton}
                  title="Modifier"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(ref.id)}
                  className={styles.deleteButton}
                  title="Supprimer"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
