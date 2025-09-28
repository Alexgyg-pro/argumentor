import { useState, useEffect } from "react";
import { ArgumentEditForm } from "./ArgumentEditForm";
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
  thesis = {},
  references,
  depth = 0,
}) {
  const [isEditing, setIsEditing] = useState(
    !argument.text || argument.text === "Nouvel argument"
  );
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedNewParentId, setSelectedNewParentId] = useState("");
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [potentialParents, setPotentialParents] = useState([]);

  useEffect(() => {
    const parents = getAllNodesExceptSubtree(
      argumentTree,
      argument.id,
      [],
      thesis?.text || ""
    );
    setPotentialParents(parents);
  }, [argumentTree, argument.id, thesis, getAllNodesExceptSubtree]);

  const handleSave = (newProperties) => {
    onEditArgument(argument.id, newProperties);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (argument.isTemporary && !argument.text.trim()) {
      onDeleteArgument(argument.id);
    } else {
      setIsEditing(false);
    }
  };

  const handleMoveClick = () => {
    setIsMoveModalOpen(true);
    setSelectedNewParentId(argument.parentId);
  };

  const confirmMove = () => {
    if (selectedNewParentId) {
      handleMoveArgument(argument.id, selectedNewParentId);
    }
    setIsMoveModalOpen(false);
  };

  const openReferenceModal = (reference) => {
    setSelectedReference(reference);
    setIsReferenceModalOpen(true);
  };

  // MODE ÉDITION
  if (isEditing) {
    return (
      <ArgumentEditForm
        argument={argument}
        onSave={handleSave}
        onCancel={handleCancel}
        references={references}
      />
    );
  }

  // MODE AFFICHAGE - AVEC LE STYLE DE LA MAQUETTE
  return (
    <li
      className={styles.argumentCard}
      style={{ marginLeft: `${depth * 20}px` }}
    >
      {/* En-tête */}
      <div className={styles.argheader}>
        <div className={styles.code} title="Code de l'argument">
          {getArgumentCode?.(argument.id)}
        </div>
        <div className={styles.forma} title="Forma de l'argument">
          {argument.forma}
        </div>
        <div
          className={styles.natura}
          title="Renforce ou affaibli l'argument parent"
        >
          {argument.natura}
        </div>
      </div>

      {/* Énoncé */}
      <p
        className={styles.enonce}
        onClick={() => setIsExplanationModalOpen(true)}
        style={{ cursor: "pointer" }}
      >
        #{argument.id.replace("arg", "")} - {argument.text}
      </p>

      {/* Pied de carte */}
      <div className={styles.argfoot}>
        <div className={styles.causa}>{argument.causa}</div>
        <div className={styles.weight} title="Valeur de l'argument">
          Validité: {argument.validity?.toFixed(1)} - Pertinence:{" "}
          {argument.relevance?.toFixed(1)} - Poids: {argument.value?.toFixed(2)}
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => setIsEditing(true)}
            title="Modifier l'argument"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteArgument(argument.id)}
            title="Supprimer l'argument"
          >
            🗑️
          </button>
          <button
            onClick={() => onAddChildArgument(argument.id)}
            title="Ajouter un argument"
          >
            ➕
          </button>
          <button onClick={handleMoveClick} title="Déplacer l'argument">
            ↔️
          </button>
        </div>
      </div>

      {/* Modales (garder le code existant d'ArgumentItem) */}
      {isExplanationModalOpen && (
        <div className="modal">{/* ... code modale explication ... */}</div>
      )}

      {/* ... autres modales ... */}
    </li>
  );
}
