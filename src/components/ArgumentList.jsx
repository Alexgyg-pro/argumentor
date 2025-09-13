// En haut de ArgumentList.jsx, AJOUTE cet import
import { ArgumentItem } from "./ArgumentItem";

// Composant principal
export function ArgumentList({
  argumentList,
  onEditArgument,
  onDeleteArgument,
  onAddChildArgument,
  getAllNodesExceptSubtree,
  handleMoveArgument,
  argumentTree,
  getArgumentCode,
  thesis,
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
              onAddChildArgument={onAddChildArgument}
              getAllNodesExceptSubtree={getAllNodesExceptSubtree}
              handleMoveArgument={handleMoveArgument}
              argumentTree={argumentTree}
              getArgumentCode={getArgumentCode}
              thesis={thesis || {}}
              depth={0}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
