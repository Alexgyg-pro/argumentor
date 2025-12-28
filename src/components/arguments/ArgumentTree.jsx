// src/components/ArgumentTree.jsx
/* ***********  ATTENTION ! IL Y A DEUX FONCTIONS DANS CE FICHIER : ArgumentNode et ArgumentTree ************/
import { useState } from "react";
import { ArgumentModal } from "../modals/ArgumentModal";
import { ReferencePreviewModal } from "../modals/ReferencePreviewModal";
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
  getArgumentCode,
  getArgumentColor,
  lineMode = new Set(),
}) {
  const isLineMode = lineMode.has(argument.id);
  const hasChildren = argument.children && argument.children.length > 0;
  const code = getArgumentCode
    ? getArgumentCode(argument.id)
    : `#${argument.id}`;
  const color = getArgumentColor ? getArgumentColor(argument.id) : "inherit";
  // Obtenir les références associées à cet argument
  const associatedRefs = references.filter((ref) =>
    argument.references?.includes(ref.id)
  );
  const [previewReference, setPreviewReference] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleReferenceClick = (reference) => {
    setPreviewReference(reference);
    setShowPreviewModal(true);
  };
  if (isLineMode) {
    // MODE ENLIGNE
    return (
      <div
        style={{
          marginLeft: `${depth * 20}px`,
          padding: "8px",
          borderLeft: `4px solid ${
            getArgumentColor ? getArgumentColor(argument.id) : "gray"
          }`,
          background: "#f5f5f5",
          borderRadius: "4px",
          marginBottom: "4px",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: "bold", color: "#666" }}>
            {getArgumentCode ? getArgumentCode(argument.id) : `#${argument.id}`}
          </span>
          <span
            style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {argument.claim || "Sans titre"}
          </span>
          <span style={{ color: "#999", fontSize: "0.8em" }}>
            {argument.children?.length ? `(${argument.children.length})` : ""}
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className={styles.argumentNode}
        style={{
          marginLeft: `${depth * 20}px`,
          paddingLeft: "20px",
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div className={styles.argumentHeader}>
          <div>
            {/* <TargetIcon size={12} />
            <LinkIcon size={12} /> */}
            {argument.natura === "validity" ? (
              <TargetIcon size={12} />
            ) : argument.natura === "relevance" ? (
              <LinkIcon size={12} />
            ) : (
              <span>?</span>
            )}
            <span>{code}</span>
          </div>
          <div>
            <ChevronUpDownIcon />
          </div>
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
                <button
                  key={ref.id}
                  className={styles.referenceBadge}
                  onClick={() => handleReferenceClick(ref)}
                  title={`Cliquer pour voir: ${ref.title}`}
                >
                  <span className={styles.refBadgeId}>{ref.id}</span>
                  <span className={styles.refBadgeTitle}>{ref.title}</span>
                </button>
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
              <PlusIcon size={12} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditArgument(argument);
              }}
              title="Modifier l'argument"
            >
              {/* <EditIcon size={12} /> */}
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
        <div className={styles.argumentChildren}>
          {argument.children.map((child) => (
            <ArgumentNode
              key={child.id}
              argument={child}
              depth={depth + 1}
              onAddArgument={onAddArgument}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              references={references}
              getArgumentCode={getArgumentCode}
              getArgumentColor={getArgumentColor}
              lineMode={lineMode}
            />
          ))}
        </div>
      )}
      {/* Modale de prévisualisation */}
      <ReferencePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        reference={previewReference}
      />
    </>
  );
}

export function ArgumentTree({
  tree,
  onAddArgument,
  onEditArgument,
  onDeleteArgument,
  onMoveArgument,
  onGetPossibleParents,
  references = [],
  getArgumentCode,
  getArgumentColor,

  // Line & Card modes
  lineMode = new Set(),
  allToLineMode = () => {},
  allToCardMode = () => {},
}) {
  const [showArgumentForm, setShowArgumentForm] = useState(false);
  const [editingArgument, setEditingArgument] = useState(null);
  const [parentId, setParentId] = useState("root");

  const handleArgumentSave = (argumentData) => {
    if (editingArgument) {
      // Vérifier si le parent a changé
      const hasParentChanged =
        argumentData.parentId &&
        argumentData.parentId !== editingArgument.parentId;

      if (hasParentChanged) {
        // 1. Déplacer l'argument
        onMoveArgument(editingArgument.id, argumentData.parentId);

        // 2. Mettre à jour les autres données (sans parentId)
        const { parentId, ...dataWithoutParent } = argumentData;
        onEditArgument(editingArgument.id, dataWithoutParent);
      } else {
        // Mode modification simple
        onEditArgument(editingArgument.id, argumentData);
      }
    } else {
      // Mode création
      onAddArgument(parentId, argumentData);
    }

    setShowArgumentForm(false);
    setEditingArgument(null);
    setParentId("root");
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

  const handleTestClick = () => {
    if (collapseAll && typeof collapseAll === "function") {
      collapseAll();
    } else {
      console.error("❌ collapseAll n'est pas une fonction");
    }
  };

  const testAllToLineMode = () => {
    // Force un changement visible
    if (lineMode && lineMode.size === 0) {
      // Si vide, ajoute un ID factice
      // Tu dois passer toggleLineMode pour ça
    }
  };

  return (
    // <div className={styles.tabContainer}>
    //   <div className={styles.tabHeader}>
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Arguments</h3>
        <button
          onClick={allToLineMode}
          style={{ padding: "8px 16px", marginRight: "10px" }}
        >
          Tout en ligne
        </button>
        <button onClick={allToCardMode} style={{ padding: "8px 16px" }}>
          Tout en carte
        </button>
        <button
          onClick={() => handleAddArgumentClick("root")}
          className={styles.addButton}
        >
          Ajouter un argument
        </button>
      </div>
      {tree.children.length === 0 ? (
        <p className={styles.emptyMessage}>Aucun argument pour le moment.</p>
      ) : (
        <div className="arguments-list">
          {tree.children.map((argument) => (
            <ArgumentNode
              key={argument.id}
              argument={argument}
              onDeleteArgument={onDeleteArgument}
              onEditArgument={handleEditArgumentClick}
              onAddArgument={handleAddArgumentClick} // CORRECT: on passe la fonction, pas juste une référence
              references={references}
              getArgumentCode={getArgumentCode} // ← Passe les fonctions
              getArgumentColor={getArgumentColor} // ← Passe les fonctions
              lineMode={lineMode}
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
          onGetPossibleParents={onGetPossibleParents}
        />
      )}
    </div>
  );
}
