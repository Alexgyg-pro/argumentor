// src/components/modals/ReferenceModal.jsx
import { Modal } from "./Modal";
import { ReferenceForm } from "../forms/ReferenceForm";

export function ReferenceModal({ initialData, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const title = initialData?.id
    ? "Modifier la référence"
    : "Nouvelle référence";

  return (
    <Modal onClose={onClose} title={title}>
      <ReferenceForm
        initialData={initialData || {}}
        onSubmit={onSave} // ← Important : "onSubmit" comme dans DefinitionForm
        onCancel={onClose} // ← Important : "onCancel" comme dans DefinitionForm
      />
    </Modal>
  );
}
