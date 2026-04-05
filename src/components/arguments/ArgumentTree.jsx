// src/components/ArgumentTree.jsx
import { useState } from "react";
import { ArgumentModal } from "../modals/ArgumentModal";
import { MoveArgumentModal } from "../modals/MoveArgumentModal";
import { ReferencePreviewModal } from "../modals/ReferencePreviewModal";
import styles from "../screens/DisplayScreen.module.css";
import {
  TargetIcon,
  LinkIcon,
  TrashIcon,
  EditIcon,
  PlusIcon,
  MoveIcon,
} from "../common/Icons";

// Composant récursif pour un argument
function ArgumentNode({
  argument,
  depth = 0,
  onDeleteArgument,
  onEditArgument,
  onAddArgument,
  openMoveModal,
  references = [],
  getArgumentCode,
  getArgumentColor,
  lineMode = new Set(),
  toggleLineMode = () => {},

  // Mode compact/développé
  isExpanded = true,
  isNodeExpanded = () => true,
  toggleNodeExpansion = () => {},
}) {
  const isLineMode = lineMode.has(argument.id);
  const hasChildren = argument.children && argument.children.length > 0;
  const shouldShowChildren = isExpanded && hasChildren;
  const code = getArgumentCode
    ? getArgumentCode(argument.id)
    : `#${argument.id}`;

  const borderColor = getArgumentColor ? getArgumentColor(argument.id) : "gray";
  const color = getArgumentColor ? getArgumentColor(argument.id) : "inherit";

  const associatedRefs = references.filter((ref) =>
    argument.references?.includes(ref.id),
  );
  const [previewReference, setPreviewReference] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleReferenceClick = (reference) => {
    setPreviewReference(reference);
    setShowPreviewModal(true);
  };

  const toggleButton = (
    <button
      className={styles.toggleModeButton}
      onClick={(e) => {
        e.stopPropagation();
        if (toggleLineMode) {
          toggleLineMode(argument.id);
        }
      }}
      title={isLineMode ? "Passer en mode carte" : "Passer en mode ligne"}
    >
      {isLineMode ? "📄" : "📏"}
    </button>
  );

  if (isLineMode) {
    return (
      <>
        <div
          className={styles.lineModeNode}
          style={{
            marginLeft: `${depth * 20}px`,
            borderLeft: `4px solid ${borderColor}`,
            cursor: "default",
          }}
        >
          <div className={styles.lineModeContent}>
            <span className={styles.lineModeIcon}>
              {argument.natura === "validity" ? (
                <TargetIcon size={12} />
              ) : argument.natura === "relevance" ? (
                <LinkIcon size={12} />
              ) : null}
            </span>

            <span className={styles.lineModeCode}>
              {getArgumentCode
                ? getArgumentCode(argument.id)
                : `#${argument.id}`}
            </span>

            {hasChildren && (
              <button
                className={styles.lineModeToggle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodeExpansion(argument.id);
                }}
                title={isExpanded ? "Réduire" : "Développer"}
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            )}

            <span className={styles.lineModeClaim} title={argument.claim}>
              {argument.claim.length > 60
                ? argument.claim.substring(0, 57) + "..."
                : argument.claim}
            </span>
            {toggleButton}
          </div>
        </div>

        {isExpanded && argument.children && argument.children.length > 0 && (
          <div className={styles.lineModeChildren}>
            {argument.children.map((child) => (
              <ArgumentNode
                key={child.id}
                argument={child}
                depth={depth + 1}
                lineMode={lineMode}
                getArgumentColor={getArgumentColor}
                getArgumentCode={getArgumentCode}
                references={references}
                toggleLineMode={toggleLineMode}
                onAddArgument={onAddArgument}
                onEditArgument={onEditArgument}
                onDeleteArgument={onDeleteArgument}
                openMoveModal={openMoveModal}
                isExpanded={isNodeExpanded(child.id)}
                toggleNodeExpansion={toggleNodeExpansion}
                isNodeExpanded={isNodeExpanded}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  // MODE CARTE
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
            {hasChildren && (
              <button
                className={styles.toggleExpandButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodeExpansion(argument.id);
                }}
                title={isExpanded ? "Réduire" : "Développer"}
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            )}
            {argument.natura === "validity" ? (
              <TargetIcon size={12} />
            ) : argument.natura === "relevance" ? (
              <LinkIcon size={12} />
            ) : (
              <span>?</span>
            )}
            <span>{code}</span>
          </div>
          <div>{toggleButton}</div>
        </div>
        <div className={styles.argumentBody}>
          <span className={styles.argumentId}>#{argument.id}</span> -{" "}
          <span className={styles.argumentClaim}>{argument.claim}</span>
        </div>

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
          <div className={styles.argumentScores}>
            <span className={styles.scoreChip + " " + styles.scoreChipValidity}>
              V {argument.validity != null ? argument.validity.toFixed(2) : "—"}
            </span>
            <span className={styles.scoreChip + " " + styles.scoreChipRelevance}>
              R {argument.relevance != null ? argument.relevance.toFixed(2) : "—"}
            </span>
            <span className={styles.scoreChip + " " + styles.scoreChipWeight}>
              W {argument.weight != null ? argument.weight.toFixed(2) : "—"}
            </span>
            <small style={{ color: "#aaa" }}>
              val. utilisateur : {(argument.value ?? 0.5).toFixed(1)}
            </small>
          </div>
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
                if (openMoveModal && typeof openMoveModal === "function") {
                  openMoveModal(argument);
                }
              }}
              title="Déplacer dans l'arbre"
            >
              <MoveIcon size={14} />
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

      {shouldShowChildren && (
        <div className={styles.argumentChildren}>
          {argument.children.map((child) => (
            <ArgumentNode
              key={child.id}
              argument={child}
              depth={depth + 1}
              onAddArgument={onAddArgument}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              openMoveModal={openMoveModal}
              references={references}
              getArgumentCode={getArgumentCode}
              getArgumentColor={getArgumentColor}
              lineMode={lineMode}
              toggleLineMode={toggleLineMode}
              isExpanded={isNodeExpanded(child.id)}
              toggleNodeExpansion={toggleNodeExpansion}
              isNodeExpanded={isNodeExpanded}
            />
          ))}
        </div>
      )}

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
  lineMode = new Set(),
  allToLineMode = () => {},
  allToCardMode = () => {},
  toggleLineMode,
  expandedNodes = new Set(),
  toggleNodeExpansion = () => {},
  expandAllNodes = () => {},
  collapseAllNodes = () => {},
  isNodeExpanded = () => true,
  forma: argumentaireForma,
}) {
  const [showArgumentForm, setShowArgumentForm] = useState(false);
  const [editingArgument, setEditingArgument] = useState(null);
  const [parentId, setParentId] = useState("root");
  const [movingArgument, setMovingArgument] = useState(null);

  // Fonction pour récupérer le forma d'un parent
  const getParentForma = (parentId) => {
    // Si parent est la thèse (root), retourner le forma de l'argumentaire
    if (parentId === "root") {
      // Convertir "Descriptif" → "descriptif", "Normatif" → "normatif", etc.
      return argumentaireForma ? argumentaireForma.toLowerCase() : "descriptif";
    }

    // Sinon, chercher l'argument parent dans l'arbre
    const findForma = (node, targetId) => {
      if (node.id === targetId) {
        return node.forma || "descriptif";
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findForma(child, targetId);
          if (found) return found;
        }
      }
      return "descriptif"; // Fallback
    };

    const parentForma = findForma(tree, parentId);
    return parentForma;
  };

  const openMoveModal = (argument) => {
    setMovingArgument(argument);
  };

  const handleArgumentSave = (argumentData) => {
    if (editingArgument) {
      const { parentId, ...editData } = argumentData;
      onEditArgument(editingArgument.id, editData);
    } else {
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
    setEditingArgument(argument);
    setParentId(argument.parentId || "root");
    setShowArgumentForm(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Arguments</h3>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "5px",
            }}
          >
            <button
              onClick={() => handleAddArgumentClick("root")}
              className={styles.addButton}
            >
              Ajouter un argument
            </button>
          </div>
          <div>
            <button
              onClick={expandAllNodes}
              style={{ padding: "8px 16px", marginRight: "10px" }}
            >
              Développer
            </button>
            <button
              onClick={collapseAllNodes}
              style={{ padding: "8px 16px", marginRight: "10px" }}
            >
              Réduire
            </button>
            <button
              onClick={allToLineMode}
              style={{ padding: "8px 16px", marginRight: "10px" }}
            >
              Tout en ligne
            </button>
            <button
              onClick={allToCardMode}
              style={{ padding: "8px 16px", marginRight: "10px" }}
            >
              Tout en carte
            </button>
          </div>
        </div>
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
              onAddArgument={handleAddArgumentClick}
              openMoveModal={openMoveModal}
              references={references}
              getArgumentCode={getArgumentCode}
              getArgumentColor={getArgumentColor}
              lineMode={lineMode}
              toggleLineMode={toggleLineMode}
              isExpanded={isNodeExpanded(argument.id)}
              toggleNodeExpansion={toggleNodeExpansion}
              isNodeExpanded={isNodeExpanded}
            />
          ))}
        </div>
      )}

      {showArgumentForm && (
        <ArgumentModal
          isOpen={showArgumentForm}
          onClose={handleArgumentCancel}
          onSave={handleArgumentSave}
          initialData={editingArgument || {}}
          parentId={parentId}
          references={references}
          onGetPossibleParents={onGetPossibleParents}
          getParentForma={getParentForma}
        />
      )}

      {movingArgument && (
        <MoveArgumentModal
          isOpen={!!movingArgument}
          onClose={() => setMovingArgument(null)}
          argument={movingArgument}
          onMove={onMoveArgument}
          getPossibleParents={onGetPossibleParents}
        />
      )}
    </div>
  );
}
