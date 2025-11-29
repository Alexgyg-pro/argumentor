// src/components/ArgumentTree.jsx
import {
  ReticleIcon,
  ReticleIcon2,
  TargetIcon,
  LinkIcon,
  RelevanceIcon,
  ArrowUpDownIcon,
  ArrowUpDownIcon2,
  ChevronUpDownIcon,
  ChevronUpDownIcon2,
  TrashIcon,
  EditIcon,
  PlusIcon,
} from "./common/Icons";
// import { Icon } from "./common/Icon";
import styles from "./ArgumentTree.module.css";

// Composant récursif pour un argument
function ArgumentNode({
  argument,
  depth = 0,
  onDeleteArgument,
  onEditArgument,
  onAddArgument,
}) {
  const hasChildren = argument.children && argument.children.length > 0;

  return (
    <>
      <div
        className={styles.argumentNode}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className={styles.argumentHeader}>
          <ReticleIcon2 />
          <LinkIcon />
          <RelevanceIcon />
          p1C1N1
          <ChevronUpDownIcon />
        </div>
        <div className={styles.argumentBody}>
          <span className={styles.argumentId}>#0001</span> -{" "}
          <span className={styles.argumentClaim}>{argument.claim}</span>
        </div>
        <div className={styles.argumentFooter}>
          <p className={styles.natura}>{argument.natura}</p>
          <small>
            {argument.causa} | {argument.forma} | {argument.natura} | Validité:{" "}
            {argument.validity} | Pertinence: {argument.relevance}
          </small>
          {/* {argument.claimComment && (
            <p className="argument-comment">{argument.claimComment}</p>
          )} */}
          <div className={styles.argumentActions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddArgument(argument.id);
              }}
              title="Ajouter un sous-argument"
            >
              <PlusIcon size={12} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditArgument(argument);
              }}
              title="Modifier l'argument"
            >
              <EditIcon size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteArgument(argument.id);
              }}
              title="Supprimer l'argument"
            >
              <TrashIcon size={12} />
            </button>
          </div>
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
              onAddArgument={onAddArgument}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function ArgumentTree({
  tree,
  onDeleteArgument,
  onEditArgument,
  onAddArgument,
}) {
  if (!tree || !tree.children || tree.children.length === 0) {
    return (
      <div className="argument-tree">
        <p className="empty-message">Aucun argument pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="argument-tree">
      <div className="arguments-list">
        {tree.children.map((argument) => (
          <ArgumentNode
            key={argument.id}
            argument={argument}
            onDeleteArgument={onDeleteArgument}
            onEditArgument={onEditArgument}
            onAddArgument={onAddArgument}
          />
        ))}
      </div>
    </div>
  );
}
