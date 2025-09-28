// ExportButton.jsx
import styles from "./EditingScreen.module.css";

export function ExportButton({ onExport, thesis }) {
  console.log("🔼 ExportButton cliqué");
  return (
    <button onClick={onExport} className={styles.exportButton}>
      💾 Exporter en JSON
    </button>
  );
}
