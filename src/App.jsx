import "./assets/styles.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { ChoiceScreen } from "./components/ChoiceScreen";
import { EditingScreen } from "./components/EditingScreen";
import "./App.css";

function App() {
  const argumentaire = useArgumentaire();

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <p style={{ fontWeight: "bold" }}>
        A la mémoire de Charlie Kirk, 1993 - 2025
      </p>

      {/* Input file toujours dans App.jsx */}
      <input
        type="file"
        ref={argumentaire.fileInputRef}
        accept=".json"
        style={{ display: "none" }}
        onChange={argumentaire.handleFileChange}
      />

      {argumentaire.currentMode === "choice" ? (
        <ChoiceScreen
          handleNew={argumentaire.handleNew}
          handleImportInit={argumentaire.handleImportInit}
        />
      ) : (
        <EditingScreen {...argumentaire} />
      )}
    </div>
  );
}

export default App;
