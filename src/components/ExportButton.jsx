// ExportButton.jsx
import styles from "./EditingScreen.module.css";

export function ExportButton({ onExport, thesis }) {
  return (
    <button onClick={onExport} className={styles.exportButton}>
      💾 Exporter en JSON
    </button>
  );
}
