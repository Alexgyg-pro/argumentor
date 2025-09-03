import { useState } from "react";

// Composant récursif pour un argument
function ArgumentItem({
  argument,
  onEditArgument,
  onDeleteArgument,
  depth = 0,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleDoubleClick = () => {
    setEditingId(argument.id);
    setEditText(argument.text);
  };

  const handleSave = () => {
    onEditArgument(argument.id, editText);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <li style={{ marginLeft: `${depth * 20}px` }}>
      {editingId === argument.id ? (
        <div>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave}>✓</button>
          <button onClick={handleCancel}>✗</button>
        </div>
      ) : (
        <div onDoubleClick={handleDoubleClick}>
          <strong>{argument.text}</strong>
          <button onClick={() => onDeleteArgument(argument.id)}>🗑️</button>
          <br />
          <small>
            Causa: {argument.causa} | Poids: {argument.weight}
          </small>
        </div>
      )}

      {/* Rendu récursif des enfants */}
      {argument.children && argument.children.length > 0 && (
        <ul>
          {argument.children.map((child) => (
            <ArgumentItem
              key={child.id}
              argument={child}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// Composant principal
export function ArgumentList({
  argumentList,
  onEditArgument,
  onDeleteArgument,
}) {
  return (
    <div className="argument-list">
      <h2>Vos arguments</h2>
      {argumentList.length === 0 ? (
        <p className="empty-message">Aucun argument pour le moment.</p>
      ) : (
        <ul>
          {argumentList.map((arg) => (
            <ArgumentItem
              key={arg.id}
              argument={arg}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
