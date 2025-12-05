import { useState } from "react";
import { DefinitionForm } from "../forms/DefinitionForm";
import styles from "./DefinitionsList.module.css";

export function DefinitionsList({
  definitions = [],
  onAddDefinition,
  onUpdateDefinition,
  onDeleteDefinition,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState(null);

  const handleNewClick = () => {
    setEditingDefinition(null);
    setShowForm(true);
  };

  const handleEdit = (definition) => {
    setEditingDefinition(definition);
    setShowForm(true);
  };

  const handleSubmit = (definitionData) => {
    if (editingDefinition) {
      onUpdateDefinition(editingDefinition.id, definitionData);
    } else {
      onAddDefinition(definitionData);
    }
    setShowForm(false);
    setEditingDefinition(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDefinition(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette définition ?")) {
      onDeleteDefinition(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Définitions</h3>
        {!showForm && (
          <button onClick={handleNewClick} className={styles.addButton}>
            Ajouter une définition
          </button>
        )}
      </div>

      {showForm ? (
        <DefinitionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingDefinition}
        />
      ) : definitions.length === 0 ? (
        <p className={styles.emptyMessage}>Aucune définition pour le moment.</p>
      ) : (
        <div className={styles.list}>
          {definitions.map((def) => (
            <div key={def.id} className={styles.item}>
              <div className={styles.content}>
                <div className={styles.term}>{def.term}</div>
                <div className={styles.definition}>{def.definition}</div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(def)}
                  className={styles.editButton}
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(def.id)}
                  className={styles.deleteButton}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
