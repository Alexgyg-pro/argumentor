// src/components/ArgumentTree.jsx
export function ArgumentTree({ tree }) {
  console.log("🌳 ArgumentTree rendu - tree:", tree);
  return (
    <div className="argument-tree">
      <h2>Vos arguments</h2>
      {tree.length === 0 ? (
        <p className="empty-message">Aucun argument pour le moment.</p>
      ) : (
        <ul>
          {tree.children.map((arg) => (
            <li key={arg.id}>{arg.claim}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
