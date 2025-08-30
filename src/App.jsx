import { useState } from "react";
import { PropositionInput } from "./components/PropositionInput";
import { ArgumentList } from "./components/ArgumentList";
import "./App.css";

function App() {
  const [proposition, setProposition] = useState("");
  const [argumentList, setArgumentList] = useState([]); // <-- Nouveau state

  const handleAddArgument = () => {
    // Pour l'instant, on ajoute un argument factice
    const newArgument = {
      id: Date.now(), // Solution simple pour un ID unique
      text: "Argument exemple " + (argumentList.length + 1),
    };
    setArgumentList([...argumentList, newArgument]);
  };

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <PropositionInput onPropositionChange={setProposition} />
      <button onClick={handleAddArgument} disabled={proposition.trim() === ""}>
        Ajouter un argument
      </button>
      {/* US-6 : Intégration de la liste */}
      <ArgumentList argumentList={argumentList} />
    </div>
  );
}

export default App;
