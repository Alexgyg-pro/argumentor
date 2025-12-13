// src/components/modals/DefinitionModal.jsx

import { Modal } from "./Modal";
import { DefinitionForm } from "../forms/DefinitionForm";

export function DefinitionModal({ isOpen, onClose, definition }) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title="Nouvelle définition">
      <DefinitionForm definition={definition} onClose={onClose} />
    </Modal>
  );
}
