// src/layout/Menu.jsx
import styles from "./Menu.module.css";

export function Menu() {
  return (
    <nav className={styles.menu}>
      <div className={styles.leftSection}>
        <span className={styles.hommage}>A la mémoire de Charlie Kirk</span>
      </div>

      <div className={styles.rightSection}>
        <a className={styles.menuItem}>Nouveau</a>
        <a className={styles.menuItem}>Importer</a>
        <a className={styles.menuItem}>Modifier</a>
        <a className={styles.menuItem}>Sauvegarder</a>
        <a className={styles.menuItem}>Exporter</a>
        <a className={styles.menuItem}>?</a>
      </div>
    </nav>
  );
}
