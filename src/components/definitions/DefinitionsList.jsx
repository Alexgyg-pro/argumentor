import { useState } from "react";
import { DefinitionForm } from "../forms/DefinitionForm";
import styles from "../screens/DisplayScreen.module.css";
import { DefinitionModal } from "../modals/DefinitionModal";
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
        // <DefinitionForm
        //   onSubmit={handleSubmit}
        //   onCancel={handleCancel}
        //   initialData={editingDefinition}
        // />
        <DefinitionModal
          isOpen={showForm}
          onClose={handleCancel}
          initialData={editingDefinition}
          onSave={handleSubmit}
        />
      ) : definitions.length === 0 ? (
        <p className={styles.emptyMessage}>Aucune définition pour le moment.</p>
      ) : (
        <div className={styles.list}>
          {definitions.map((def) => (
            <div key={def.id} className={styles.item}>
              <div className={styles.content}>
                <div className={styles.DefRefTitle}>{def.term}</div>
                <div className={styles.DefRefContent}>{def.definition}</div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(def)}
                  className={styles.editButton}
                  title="Modifier"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(def.id)}
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
