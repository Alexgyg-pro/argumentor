// src/components/modals/ArgumentaireModal.jsx
import { Modal } from "./Modal";
import { ArgumentaireForm } from "../forms/ArgumentaireForm";

export function ArgumentaireModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title="Modifier l'argumentaire">
      <ArgumentaireForm
        initialData={initialData}
        onSave={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
