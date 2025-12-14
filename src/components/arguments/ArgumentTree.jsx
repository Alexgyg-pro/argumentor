// src/components/ArgumentTree.jsx
/* ***********  ATTENTION ! IL Y A DEUX FONCTIONS DANS CE FICHIER : ArgumentNode et ArgumentTree ************/
import { useState } from "react";
import { ArgumentModal } from "../modals/ArgumentModal";
import styles from "../screens/DisplayScreen.module.css";
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
} from "../common/Icons";
// import { Icon } from "./common/Icon";

// Composant récursif pour un argument
function ArgumentNode({
  argument,
  depth = 0,
  onDeleteArgument,
  onEditArgument,
  onAddArgument,
  references = [],
}) {
  const hasChildren = argument.children && argument.children.length > 0;

  // Obtenir les références associées à cet argument
  const associatedRefs = references.filter((ref) =>
    argument.references?.includes(ref.id)
  );
  return (
    <>
      <div
        className={styles.argumentNode}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className={styles.argumentHeader}>
          <div>
            {/* Tes icônes ici */}
            <span>p1C1N1</span>
          </div>
          <div>{/* Icône chevron */}</div>
        </div>
        <div className={styles.argumentBody}>
          <span className={styles.argumentId}>#{argument.id}</span> -{" "}
          <span className={styles.argumentClaim}>{argument.claim}</span>
        </div>

        {/* AFFICHAGE DES RÉFÉRENCES ASSOCIÉES */}
        {associatedRefs.length > 0 && (
          <div className={styles.associatedReferences}>
            <div className={styles.referencesHeader}>
              <small>📚 Références associées :</small>
            </div>
            <div className={styles.referencesList}>
              {associatedRefs.map((ref) => (
                <div key={ref.id} className={styles.referenceBadge}>
                  <span className={styles.refBadgeId}>{ref.id}</span>
                  <span className={styles.refBadgeTitle}>{ref.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.argumentFooter}>
          <p className={styles.natura}>{argument.natura}</p>
          <small>
            {argument.causa} | {argument.forma} | {argument.natura} | Validité:{" "}
            {argument.validity} | Pertinence: {argument.relevance}
          </small>
          <div className={styles.argumentActions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddArgument(argument.id);
              }}
              title="Ajouter un sous-argument"
            >
              {/* <PlusIcon size={12} /> */}+
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditArgument(argument);
              }}
              title="Modifier l'argument"
            >
              {/* <EditIcon size={12} /> */}
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteArgument(argument.id);
              }}
              title="Supprimer l'argument"
            >
              {/* <TrashIcon size={12} /> */}
              🗑️
            </button>
          </div>
        </div>
      </div>
      {/* Affichage récursif des enfants */}
      {hasChildren && (
        <div className={styles.argumentChildren}>
          {argument.children.map((child) => (
            <ArgumentNode
              key={child.id}
              argument={child}
              depth={depth + 1}
              onAddArgument={onAddArgument}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              references={references} // ← Passe les références aux enfants
            />
          ))}
        </div>
      )}
    </>
  );
}

export function ArgumentTree({
  tree,
  onAddArgument,
  onEditArgument,
  onDeleteArgument,
  references = [],
}) {
  const [showArgumentForm, setShowArgumentForm] = useState(false);
  const [editingArgument, setEditingArgument] = useState(null);
  const [parentId, setParentId] = useState("root");

  // ARGUMENT HANDLERS
  const handleArgumentSave = (argumentData) => {
    if (editingArgument) {
      // Mode modification - CORRECT
      onEditArgument(editingArgument.id, argumentData);
    } else {
      // Mode création
      onAddArgument(parentId, argumentData);
    }
    setShowArgumentForm(false);
    setEditingArgument(null);
    setParentId("root"); // <-- Reset parentId after adding
  };

  const handleArgumentCancel = () => {
    setShowArgumentForm(false);
    setEditingArgument(null);
    setParentId("root");
  };

  const handleAddArgumentClick = (newParentId = "root") => {
    setParentId(newParentId);
    setEditingArgument(null);
    setShowArgumentForm(true);
  };

  const handleEditArgumentClick = (argument) => {
    setEditingArgument(argument); // Stocker l'argument à modifier
    setParentId(argument.parentId || "root");
    setShowArgumentForm(true);
  };

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <h3>Arguments</h3>
        <button
          onClick={() => handleAddArgumentClick("root")}
          className={styles.addButton}
        >
          Ajouter un argument
        </button>
      </div>
      {tree.children.length === 0 ? (
        <p className={styles.emptyMessage}>
          Aucun argument pour le moment.{console.log(tree)}
        </p>
      ) : (
        <div className="arguments-list">
          {tree.children.map((argument) => (
            <ArgumentNode
              key={argument.id}
              argument={argument}
              onDeleteArgument={onDeleteArgument}
              onEditArgument={handleEditArgumentClick}
              onAddArgument={handleAddArgumentClick} // CORRECT: on passe la fonction, pas juste une référence
            />
          ))}
        </div>
      )}
      {/* Modale pour ajouter/modifier un argument */}
      {showArgumentForm && (
        <ArgumentModal
          isOpen={showArgumentForm}
          onClose={handleArgumentCancel}
          onSave={handleArgumentSave}
          initialData={editingArgument || {}}
          parentId={parentId}
          references={references}
        />
      )}
    </div>
  );
}
