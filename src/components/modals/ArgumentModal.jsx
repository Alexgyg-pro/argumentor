// src/components/modals/ArgumentModal.jsx
import { Modal } from "./Modal";
import { ArgumentForm } from "../forms/ArgumentForm";

export function ArgumentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  parentId,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      onClose={onClose}
      title={initialData.id ? "Modifier l'argument" : "Nouvel argument"}
    >
      <ArgumentForm
        parentId={parentId}
        initialData={initialData}
        onSave={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
