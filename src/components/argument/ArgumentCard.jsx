import { ArgumentItem } from "./ArgumentItem";
import styles from "./ArgumentCard.module.css";

export function ArgumentCard({
  argument,
  onEditArgument,
  onDeleteArgument,
  onAddChildArgument,
  getAllNodesExceptSubtree,
  handleMoveArgument,
  argumentTree,
  getArgumentCode,
  thesis,
  references,
  depth = 0,
}) {
  return (
    <>
      {/* L'argument actuel */}
      <ArgumentItem
        argument={argument}
        onEditArgument={onEditArgument}
        onDeleteArgument={onDeleteArgument}
        onAddChildArgument={onAddChildArgument}
        getAllNodesExceptSubtree={getAllNodesExceptSubtree}
        handleMoveArgument={handleMoveArgument}
        argumentTree={argumentTree}
        getArgumentCode={getArgumentCode}
        thesis={thesis}
        references={references}
        depth={depth}
      />

      {/* Ses enfants dans une liste indentée */}
      {argument.children && argument.children.length > 0 && (
        <ul className={styles.childrenList}>
          {argument.children.map((child) => (
            <ArgumentCard
              key={child.id}
              argument={child}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              onAddChildArgument={onAddChildArgument}
              getAllNodesExceptSubtree={getAllNodesExceptSubtree}
              handleMoveArgument={handleMoveArgument}
              argumentTree={argumentTree}
              getArgumentCode={getArgumentCode}
              thesis={thesis}
              references={references}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </>
  );
}
