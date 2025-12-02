export function DefinitionsList() {
  return (
    <div>
      {false ? (
        <p>Aucun argument pour le moment.</p>
      ) : (
        <ul>
          <li>Définition 1</li>
          <li>Définition 2</li>
          <li>Définition 3</li>
        </ul>
      )}
    </div>
  );
}
