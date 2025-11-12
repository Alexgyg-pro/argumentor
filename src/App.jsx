// src/App.jsx
import { useState } from "react";
import { ThesisInput } from "./components/ThesisInput";
import { ArgumentList } from "./components/ArgumentList";
import { ExportButton } from "./components/ExportButton";
import { ImportButton } from "./components/ImportButton";
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
  const [thesis, setThesis] = useState("");
  const [argumentList, setArgumentList] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const handleNewArgumentaire = () => {
    setThesis("");
    setArgumentList([]);
    setIsDirty(false);
  };

  const handleAddArgument = () => {
    const newArgument = {
      id: Date.now(), // Solution simple pour un ID unique
      claim: "Argument exemple " + (argumentList.length + 1),
    };
    setArgumentList([...argumentList, newArgument]);
  };

  const handleImport = (jsonData) => {
    if (jsonData.thesis) {
      setThesis(jsonData.thesis); // Pre-remplit le champ
    }
    setIsDirty(false);
    // Les arguments à venir : setArgumentList ici
  };

  const confirmNavigation = (actionCallback) => {
    if (!isDirty) {
      actionCallback(); // Exécute l'action directement si rien n'est modifié
      return;
    }

    if (
      window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous sauvegarder avant de continuer ?"
      )
    ) {
      actionCallback();
    } else {
      setIsDirty(false);
    }
    setIsDirty(false);
  };

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <ThesisInput onThesisChange={setThesis} value={thesis} />
      <p>Thèse actuelle : {thesis}</p>
      <button onClick={handleAddArgument} disabled={thesis.trim() === ""}>
        Ajouter un argument
      </button>
      <ArgumentList argumentList={argumentList} />
      <ExportButton thesis={thesis} />
      <div className="controls">
        <button
          onClick={() => {
            confirmNavigation(handleNewArgumentaire);
          }}
        >
          ➕ Nouveau
        </button>
        <ImportButton
          onImport={(data) => confirmNavigation(() => handleImport(data))}
        />
      </div>
      <PlusIcon size={18} />
      <DownloadIcon size={18} /> <UploadIcon size={18} />
      <EditIcon size={18} />
      <TrashIcon size={18} />
      <PdfIcon size={18} /> <NewIcon size={18} />
    </div>
  );
}

export default App;
