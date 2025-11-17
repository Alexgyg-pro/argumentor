// src/components/ArgumentTree.jsx
import { TrashIcon, EditIcon, PlusIcon } from "./common/Icons";

// Composant récursif pour un argument
function ArgumentNode({
  argument,
  depth = 0,
  onDeleteArgument,
  onEditArgument,
  onAddSubArgument,
}) {
  const hasChildren = argument.children && argument.children.length > 0;

  return (
    <div className="argument-node" style={{ marginLeft: `${depth * 20}px` }}>
      <div className="argument-content">
        <span className="argument-claim">• {argument.claim}</span>
        <div className="argument-details">
          <small>
            {argument.causa} | {argument.forma} | {argument.natura} | Validité:{" "}
            {argument.validity} | Pertinence: {argument.relevance}
          </small>
          {argument.claimComment && (
            <p className="argument-comment">{argument.claimComment}</p>
          )}
        </div>
        <div className="argument-actions">
          <button
            onClick={() => onAddSubArgument(argument.id)}
            title="Ajouter un sous-argument"
          >
            <PlusIcon size={12} />
          </button>
          <button
            onClick={() => onEditArgument(argument)}
            title="Modifier l'argument"
          >
            <EditIcon size={12} />
          </button>
          <button
            onClick={() => onDeleteArgument(argument.id)}
            title="Supprimer l'argument"
          >
            <TrashIcon size={12} />
          </button>
        </div>
      </div>

      {/* Affichage récursif des enfants */}
      {hasChildren && (
        <div className="argument-children">
          {argument.children.map((child) => (
            <ArgumentNode
              key={child.id}
              argument={child}
              depth={depth + 1}
              onDeleteArgument={onDeleteArgument}
              onEditArgument={onEditArgument}
              onAddSubArgument={onAddSubArgument}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ArgumentTree({
  tree,
  onDeleteArgument,
  onEditArgument,
  onAddSubArgument,
}) {
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
      <div className="arguments-list">
        {tree.children.map((argument) => (
          <ArgumentNode
            key={argument.id}
            argument={argument}
            onDeleteArgument={onDeleteArgument}
            onEditArgument={onEditArgument}
            onAddSubArgument={onAddSubArgument}
          />
        ))}
      </div>
    </div>
  );
}
