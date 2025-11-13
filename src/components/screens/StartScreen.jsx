// src/components/screens/StartScreen.jsx
import { ThesisInput } from "../ThesisInput";
export function StartScreen({ onNewArgumentaire, onImportInit }) {
  return (
    <div className="start-screen">
      <h1>Argumentor</h1>
      <button onClick={onNewArgumentaire}>Nouvel argumentaire</button>
      <button onClick={onImportInit}>Ouvrir un argumentaire</button>
    </div>
  );
}
