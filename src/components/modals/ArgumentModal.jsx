// src/components/modals/ArgumentModal.jsx
import { Modal } from "./Modal";
import { ArgumentForm } from "../forms/ArgumentForm";

export function ArgumentModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  parentId,
  references = [],
  onGetPossibleParents,
  getParentForma,
}) {
  if (!isOpen) return null;

  const title = initialData.id ? "Modifier l'argument" : "Nouvel argument";

  return (
    <Modal
      onClose={onClose}
      title={initialData.id ? "Modifier l'argument" : "Nouvel argument"}
    >
      <ArgumentForm
        parentId={parentId}
        initialData={initialData}
        onSubmit={onSave}
        onCancel={onClose}
        references={references}
        onGetPossibleParents={onGetPossibleParents}
        getParentForma={getParentForma}
      />
    </Modal>
  );
}
