import { useState } from "react";

export function ArgumentList({
  argumentList,
  onEditArgument,
  onDeleteArgument,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleDoubleClick = (arg) => {
    setEditingId(arg.id);
    setEditText(arg.text);
  };

  const handleSave = (id) => {
    onEditArgument(id, editText);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="argument-list">
      <h2>Vos arguments</h2>
      {argumentList.length === 0 ? (
        <p className="empty-message">Aucun argument pour le moment.</p>
      ) : (
        <ul>
          {argumentList.map((arg) => (
            <li key={arg.id} onDoubleClick={() => handleDoubleClick(arg)}>
              {editingId === arg.id ? (
                <div>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => handleSave(arg.id)}>✓</button>
                  <button onClick={handleCancel}>✗</button>
                </div>
              ) : (
                <div>
                  <strong>{arg.text}</strong>
                  <button
                    onClick={() => onDeleteArgument(arg.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    🗑️
                  </button>
                  <br />
                  <small>
                    Causa: {arg.causa} | Poids: {arg.weight}
                  </small>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
