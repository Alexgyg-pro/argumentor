// src/components/modals/ReferencePreviewModal.jsx
import { Modal } from "./Modal";
import styles from "./Modal.module.css";

export function ReferencePreviewModal({ isOpen, onClose, reference }) {
  if (!isOpen) return null;
  if (!reference) return null;

  return (
    <Modal onClose={onClose} title={`Référence : ${reference.title}`}>
      <div className={styles.referencePreview}>
        <div className={styles.referenceHeader}>
          <h3>{reference.title}</h3>
          <small>ID: {reference.id}</small>
        </div>

        <div className={styles.referenceContent}>
          <h4>Contenu :</h4>
          <p>{reference.content}</p>
        </div>

        {reference.metadata && (
          <div className={styles.referenceMetadata}>
            <h4>Métadonnées :</h4>
            <ul>
              {reference.metadata.author && (
                <li>Auteur: {reference.metadata.author}</li>
              )}
              {reference.metadata.year && (
                <li>Année: {reference.metadata.year}</li>
              )}
              {reference.metadata.source && (
                <li>Source: {reference.metadata.source}</li>
              )}
            </ul>
          </div>
        )}

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.closeButton}>
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
