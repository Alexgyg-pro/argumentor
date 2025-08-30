export function ArgumentList({ argumentList }) {
  return (
    <div className="argument-list">
      <h2>Vos arguments</h2>
      {argumentList.length === 0 ? (
        <p className="empty-message">Aucun argument pour le moment.</p>
      ) : (
        <ul>
          {argumentList.map((arg) => (
            <li key={arg.id}>{arg.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
