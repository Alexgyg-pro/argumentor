import styles from "./Header.module.css"; // ← IMPORT AJOUTÉ

export function Header() {
  return (
    <header className={styles.header}>
      {" "}
      <h1 className={styles.title}>Argumentor</h1>
      <p className={styles.subtitle}>Calculateur argumentaire</p>
    </header>
  );
}
