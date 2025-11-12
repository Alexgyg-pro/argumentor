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
  const [argumentList, setArguments] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const handleAddArgument = () => {
    const newArgument = {
      id: Date.now(), // Solution simple pour un ID unique
      claim: "Argument exemple " + (argumentList.length + 1),
    };
    setArguments([...argumentList, newArgument]);
  };

  const handleImport = (jsonData) => {
    if (jsonData.thesis) {
      setThesis(jsonData.thesis); // Pre-remplit le champ
    }
    // Les arguments à venir : setArgumentList ici
  };

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <ThesisInput onThesisChange={setThesis} />
      <p>Thèse actuelle : {thesis}</p>
      <button onClick={handleAddArgument} disabled={thesis.trim() === ""}>
        Ajouter un argument
      </button>
      <ArgumentList argumentList={argumentList} />
      <div>
        <ExportButton thesis={thesis} />
        <ImportButton onImport={handleImport} />
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
