// src/components/ArgumentTree.jsx
import { TrashIcon, PlusIcon } from "./common/Icons";
export function ArgumentTree({ tree, onDeleteArgument }) {
  return (
    <div className="argument-tree">
      <h2>Vos arguments</h2>
      {tree.length === 0 ? (
        <p className="empty-message">Aucun argument pour le moment.</p>
      ) : (
        <ul>
          {tree.children.map((arg) => (
            <li key={arg.id} className="argument-item">
              <span>• {arg.claim}</span>
              <div className="argument-actions">
                <button onClick={() => onDeleteArgument(arg.id)}>
                  <TrashIcon size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
