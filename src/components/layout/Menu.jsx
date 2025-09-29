import styles from "./Menu.module.css";

export function Menu() {
  return (
    <nav className={styles.menu}>
      <a className={styles.menuItem}>Nouveau</a>
      <a className={styles.menuItem}>Importer</a>
      <a className={styles.menuItem}>Modifier</a>
      <a className={styles.menuItem}>Sauvegarder</a>
      <a className={styles.menuItem}>Exporter</a>
      <a className={styles.menuItem}>?</a>
    </nav>
  );
}
