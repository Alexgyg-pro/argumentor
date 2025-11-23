import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo} style={{ cursor: "pointer" }}>
          Argumentor
        </h1>
        <p className={styles.subtitle}>Calculateur argumentaire</p>
      </div>
    </header>
  );
}
