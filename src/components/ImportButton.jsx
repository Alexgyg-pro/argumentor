// src/components/ImportButton.jsx

import { useRef } from "react";

export function ImportButton({ onImportInit }) {
  console.log(onImportInit);

  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        onImport(jsonContent); // Envoie les données au parent
      } catch (error) {
        alert("Erreur : Fichier JSON invalide !");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button onClick={() => fileInputRef.current?.click()}>
        📂 Importer un JSON
      </button>
    </>
  );
}
