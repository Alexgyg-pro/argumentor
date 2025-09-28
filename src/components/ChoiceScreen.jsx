// src/components/ChoiceScreen.jsx
import styles from "./ChoiceScreen.module.css";

// Version simplifiée sans hook custom
export function ChoiceScreen({ handleNew, handleFileChange, fileInputRef }) {
  console.log("🔍 ChoiceScreen props:", {
    handleNew: typeof handleNew,
    handleFileChange: typeof handleFileChange,
    fileInputRef: !!fileInputRef,
  });

  const handleImportInit = () => {
    fileInputRef.current?.click();
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && handleImport) {
  //     handleImport(file);
  //   }
  // };

  return (
    <div className={styles.choiceScreen}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange} // ← Utiliser directement handleFileChange des props
        accept=".json"
        style={{ display: "none" }}
      />

      <div className={styles.container}>
        <h1 className={styles.title}>Bienvenue dans Argumentor</h1>
        <div className={styles.actions}>
          <button onClick={handleNew} className={styles.primaryButton}>
            📝 Nouveau
          </button>
          <button onClick={handleImportInit} className={styles.secondaryButton}>
            📂 Importer
          </button>
        </div>
      </div>
    </div>
  );
}
