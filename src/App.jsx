// src/App.jsx
import { useState } from "react";
import { useArgumentaire } from "./hooks/useArgumentaire";
//import { ThesisInput } from "./components/ThesisInput";
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

  // const confirmNavigation = (actionCallback) => {
  //   if (!isDirty) {
  //     actionCallback(); // Exécute l'action directement si rien n'est modifié
  //     return;
  //   }

  //   if (
  //     window.confirm(
  //       "Vous avez des modifications non sauvegardées. Voulez-vous sauvegarder avant de continuer ?"
  //     )
  //   ) {
  //     // Ici, tu pourrais déclencher un export automatique puis faire l'action
  //     handleExport(); // Tu devras créer cette fonction qui exporte et reset isDirty
  //     actionCallback();
  //   } else {
  //     actionCallback(); // Ou exécute l'action sans sauvegarder
  //   }
  //   setIsDirty(false); // Reset l'état après l'action
  // };

  return (
    <div className="app">
      {argumentaire.currentMode === "start" ? (
        <StartScreen
          onNewArgumentaire={argumentaire.handleNewArgumentaire}
          onImportInit={argumentaire.handleImportInit}
        />
      ) : (
        <DisplayScreen
          onNewArgumentaire={argumentaire.handleNewArgumentaire}
          thesis={argumentaire.thesis}
          contexte={argumentaire.contexte}
          forma={argumentaire.forma}
          onUpdateArgumentaire={argumentaire.handleUpdateArgumentaire}
          //onThesisChange={argumentaire.handleThesisChange}
          argumentTree={argumentaire.argumentTree}
          onAddArgument={argumentaire.handleAddArgument}
          onEditArgument={argumentaire.handleEditArgument}
          onDeleteArgument={argumentaire.handleDeleteArgument}
          onExport={argumentaire.handleExport}
          onImportInit={argumentaire.handleImportInit}
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
