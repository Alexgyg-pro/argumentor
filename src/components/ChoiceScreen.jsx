export function ChoiceScreen({ handleNew, handleImportInit }) {
  return (
    <div className="choice-screen">
      <button onClick={handleNew}>➕ Nouvel argumentaire</button>
      <button onClick={() => handleImportInit()}>
        📂 Ouvrir un argumentaire
      </button>
    </div>
  );
}
