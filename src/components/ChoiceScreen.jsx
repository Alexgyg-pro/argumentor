export function ChoiceScreen({
  handleNew,
  handleImportInit,
  setArgumentTree,
  setArgumentList,
}) {
  const loadTestTree = () => {
    const testTree = {
      id: "root",
      text: "La Terre est ronde",
      causa: null,
      children: [
        {
          id: 1,
          text: "Si elle était ronde les habitants du Sud seraient en dessous",
          causa: "contra",
          parentId: "root",
          children: [
            {
              id: 2,
              text: "Si les habitants étaient en bas, ils tomberaient dans l'espace",
              causa: "pro",
              parentId: 1,
              children: [],
            },
          ],
        },
      ],
    };
    setArgumentTree(testTree);
    setArgumentList(testTree.children);
    setCurrentMode("editing"); // Pour passer directement à l'écran d'édition
  };

  return (
    <div className="choice-screen">
      <button onClick={handleNew}>➕ Nouvel argumentaire</button>
      <button onClick={handleImportInit}>📂 Ouvrir un argumentaire</button>
      <button onClick={loadTestTree}>🧪 Charger arbre de test</button>
    </div>
  );
}
