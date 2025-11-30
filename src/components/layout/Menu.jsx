// src/layout/Menu.jsx

import { confirmIfDirty } from "../../utils/confirm.js";
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
}) {
  return (
    <nav className={styles.menu}>
      <div className={styles.leftSection}>
        <span className={styles.hommage}>A la mémoire de Charlie Kirk</span>
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
            onSave?.();
          }}
          className={styles.menuItem}
        >
          Sauvegarder
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
            onExport?.();
          }}
          className={styles.menuItem}
        >
          Exporter
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onHelp?.();
          }}
          className={styles.menuItem}
        >
          ?
        </a>
      </div>
    </nav>
  );
}
