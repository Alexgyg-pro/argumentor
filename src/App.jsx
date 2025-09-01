import { useArgumentaire } from "./hooks/useArgumentaire";
import { ChoiceScreen } from "./components/ChoiceScreen";
import { EditingScreen } from "./components/EditingScreen";
import "./App.css";

// Dans App.jsx
function App() {
  const argumentaire = useArgumentaire();

  return (
    <div className="app">
      <h1>Argumentor</h1>

      {/* Input file toujours dans App.jsx */}
      <input
        type="file"
        ref={argumentaire.fileInputRef}
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              argumentaire.handleNavigateAway(() =>
                argumentaire.handleImportSuccess(jsonData)
              );
            } catch (error) {
              alert("Fichier JSON invalide");
            }
          };
          reader.readAsText(file);
        }}
      />

      {argumentaire.currentMode === "choice" ? (
        <ChoiceScreen {...argumentaire} />
      ) : (
        <EditingScreen {...argumentaire} />
      )}
    </div>
  );
}

export default App;
