// src/App.jsx
import { useState } from "react";
import { ThesisInput } from "./components/ThesisInput";
import { ArgumentList } from "./components/ArgumentList";
import "./App.css";

function App() {
  const [thesis, setThesis] = useState("");
  const [argumentList, setArguments] = useState([]);

  const handleAddArgument = () => {
    const newArgument = {
      id: Date.now(), // Solution simple pour un ID unique
      claim: "Argument exemple " + (argumentList.length + 1),
    };
    setArguments([...argumentList, newArgument]);
  };

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <ThesisInput onThesisChange={setThesis} />
      <p>Proposition actuelle : {thesis}</p> {/* Pour debug */}
      <button onClick={handleAddArgument} disabled={thesis.trim() === ""}>
        Ajouter un argument
      </button>
      <ArgumentList argumentList={argumentList} />
    </div>
  );
}

export default App;
