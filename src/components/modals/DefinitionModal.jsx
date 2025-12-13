// src/components/modals/DefinitionModal.jsx

import { Modal } from "./Modal";
import { DefinitionForm } from "../forms/DefinitionForm";

export function DefinitionModal({ initialData, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title="Nouvelle définition">
      <DefinitionForm
        initialData={initialData}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
