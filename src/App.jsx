// src/App.jsx
import { useState } from "react";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { ThesisInput } from "./components/ThesisInput";
//import { ArgumentList } from "./components/ArgumentList";
import { ExportButton } from "./components/ExportButton";
import { ImportButton } from "./components/ImportButton";
import { StartScreen } from "./components/screens/StartScreen";
import { DisplayScreen } from "./components/screens/DisplayScreen";

import {
  PlusIcon,
  DownloadIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  PdfIcon,
  NewIcon,
} from "./components/common/Icons";
import "./App.css";

function App() {
  const argumentaire = useArgumentaire();

  return (
    <div className="app">
      {argumentaire.currentMode === "start" ? (
        <StartScreen
          onNewArgumentaire={argumentaire.handleNewArgumentaire}
          onImportInit={argumentaire.handleImportInit}
        />
      ) : (
        <DisplayScreen
          thesis={argumentaire.thesis}
          onThesisChange={argumentaire.handleThesisChange}
          argumentTree={argumentaire.argumentTree}
          onAddArgument={argumentaire.handleAddArgument}
          onExport={argumentaire.handleExport}
        />
      )}

      {/* Input file caché pour l'import */}
      <input
        type="file"
        ref={argumentaire.fileInputRef}
        onChange={argumentaire.handleFileSelect}
        accept=".json"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default App;
