// src/components/layout/Menu.jsx
import { useState } from "react";
import { confirmIfDirty } from "../../utils/confirm.js";
import { HelpModal } from "../help/HelpModal";
import styles from "./Menu.module.css";

export function Menu({
  onNew,
  onImport,
  onEdit,
  onSave,
  onDownload,
  onExport,
  onHelp,
  isDirty,
  onLoadExample,
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  console.log("📋 Menu rendu, helpOpen:", helpOpen);
  //const { handleLoadExample } = useArgumentaire();
  // A la mémoire de Charlie Kirk
  return (
    <nav className={styles.menu}>
      <div className={styles.leftSection}>
        <span className={styles.hommage}></span>
      </div>

      <div className={styles.rightSection}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (confirmIfDirty(isDirty)) {
              onNew?.();
            }
          }}
          className={styles.menuItem}
        >
          Nouveau
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (confirmIfDirty(isDirty)) {
              onImport?.();
            }
          }}
          className={styles.menuItem}
        >
          Importer
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onEdit?.();
          }}
          className={styles.menuItem}
        >
          Modifier
        </a>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onDownload?.();
          }}
          className={styles.menuItem}
        >
          Télécharger
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onExport?.(); // ← Exporter PDF
          }}
          className={styles.menuItem}
          title="Exporter au format PDF"
        >
          Exporter PDF
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            console.log("🖱️ Clic sur ?");
            setHelpOpen(true);
            console.log("✅ helpOpen devrait être true maintenant");
          }}
          className={styles.menuItem}
        >
          ?
        </a>
      </div>
      {/* Modal d'aide */}
      {helpOpen && (
        <HelpModal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          onLoadExample={onLoadExample}
        />
      )}
    </nav>
  );
}
