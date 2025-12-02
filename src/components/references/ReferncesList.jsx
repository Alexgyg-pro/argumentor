export function ReferencesList() {
  return (
    <div>
      {false ? (
        <p>Aucune référence pour le moment.</p>
      ) : (
        <ul>
          <li>Référence 1</li>
          <li>Référence 2</li>
          <li>Référence 3</li>
        </ul>
      )}
    </div>
  );
}
