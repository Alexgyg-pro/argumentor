// src/App.jsx
import { useState } from "react";
import { ThesisInput } from "./ThesisInput";
import "./App.css";

function App() {
  const [thesis, setThesis] = useState("");

  return (
    <div className="app">
      <h1>Argumentor</h1>
      <ThesisInput onThesisChange={setThesis} />
      {/* On verra US-5 et US-6 ici après */}
      <p>Proposition actuelle : {thesis}</p> {/* Pour debug */}
    </div>
  );
}

export default App;
