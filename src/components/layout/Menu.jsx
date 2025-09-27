import styles from "./Menu.module.css";

export function Menu() {
  return (
    <nav className={styles.menu}>
      <a className={styles.menuItem}>Nouvel argumentaire</a>
      <a className={styles.menuItem}>Importer</a>
      <a className={styles.menuItem}>Sauvegarder</a>
      <a className={styles.menuItem}>Exporter</a>
    </nav>
  );
}
