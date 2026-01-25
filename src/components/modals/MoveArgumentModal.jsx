// src/components/modals/MoveArgumentModal.jsx
import { useState } from "react";
import { Modal } from "./Modal";
import styles from "./Modal.module.css";
export function MoveArgumentModal({
  isOpen,
  onClose,
  argument,
  onMove,
  getPossibleParents,
}) {
  const [selectedParentId, setSelectedParentId] = useState(argument.parentId);
  const possibleParents = getPossibleParents
    ? getPossibleParents(argument.id)
    : [];

  const handleSubmit = () => {
    if (selectedParentId !== argument.parentId) {
      onMove(argument.id, selectedParentId);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>Déplacer l'argument</h3>
      <p>
        <strong>{argument.claim}</strong>
      </p>
      <p>Choisissez le nouveau parent :</p>
      <select
        value={selectedParentId}
        onChange={(e) => setSelectedParentId(e.target.value)}
      >
        {possibleParents.map((parent) => (
          <option key={parent.id} value={parent.id}>
            {parent.claim.substring(0, 50)}...
          </option>
        ))}
      </select>
      <div className={styles.modalActions}>
        <button onClick={handleSubmit}>Déplacer</button>
        <button onClick={onClose}>Annuler</button>
      </div>
      <p className={styles.helpText}>
        <small>
          ⚠️ L'argument et ses sous-arguments deviendront neutres après
          déplacement.
        </small>
      </p>
    </Modal>
  );
}
