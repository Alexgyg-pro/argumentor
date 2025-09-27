// ChoiceScreen.jsx
import styles from "./ChoiceScreen.module.css"; // ← IMPORT MANQUANT

export function ChoiceScreen({ handleNew, handleImportInit }) {
  return (
    <div className={styles.choiceScreen}>
      {" "}
      {/* ← UTILISER styles. */}
      <div className={styles.container}>
        <h1 className={styles.title}>Bienvenue dans Argumentor</h1>

        <div className={styles.actions}>
          <button onClick={handleNew} className={styles.primaryButton}>
            📝 Nouveau
          </button>
          <button onClick={handleImportInit} className={styles.secondaryButton}>
            📂 Importer
          </button>
          {/* ... */}
        </div>
      </div>
    </div>
  );
}
