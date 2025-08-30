export function ExportButton({ proposition }) {
  const handleExport = () => {
    // 1. Créer l'objet JSON simple
    const data = {
      proposition: proposition,
      version: "1.0", // Toujours bon d'avoir une version
    };

    // 2. Convertir en string JSON
    const jsonString = JSON.stringify(data, null, 2); // null, 2 pour l'indentation

    // 3. Créer un blob et un lien de téléchargement
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "argumentaire.json"; // Nom du fichier
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} disabled={!proposition}>
      💾 Exporter en JSON
    </button>
  );
}
