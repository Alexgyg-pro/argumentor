// src/components/modals/Modal.jsx
import styles from "./Modal.module.css";

export function Modal({ children, onClose, title, size, className = "" }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.content}  ${
          size ? styles[size] : ""
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
