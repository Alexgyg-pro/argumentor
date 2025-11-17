// src/components/ArgumentTree.jsx
import { TrashIcon, EditIcon, PlusIcon } from "./common/Icons";

export function ArgumentTree({ tree, onDeleteArgument, onEditArgument }) {
  if (!tree || !tree.children || tree.children.length === 0) {
    return (
      <div className="argument-tree">
        <h2>Vos arguments</h2>
        <p className="empty-message">Aucun argument pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="argument-tree">
      <h2>Vos arguments</h2>
      <ul>
        {tree.children.map((arg) => (
          <li key={arg.id} className="argument-item">
            <div className="argument-content">
              <span className="argument-claim">• {arg.claim}</span>
              <div className="argument-details">
                <small>
                  {arg.causa} | {arg.forma} | {arg.natura} | Validité:{" "}
                  {arg.validity} | Pertinence: {arg.relevance}
                </small>
                {arg.claimComment && (
                  <p className="argument-comment">{arg.claimComment}</p>
                )}
              </div>
            </div>
            <div className="argument-actions">
              <button
                onClick={() => onEditArgument(arg)}
                title="Modifier l'argument"
              >
                <EditIcon size={14} />
              </button>
              <button onClick={() => onDeleteArgument(arg.id)}>
                <TrashIcon size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
