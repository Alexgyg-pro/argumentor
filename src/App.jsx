import { useState } from "react";
import { PropositionInput } from "./components/PropositionInput";
import "./App.css";

function App() {
  const [proposition, setProposition] = useState("");

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <PropositionInput onPropositionChange={setProposition} />
      {/* On verra US-5 et US-6 ici après */}
      <p>Proposition actuelle : {proposition}</p> {/* Pour debug */}
    </div>
  );
}

export default App;
