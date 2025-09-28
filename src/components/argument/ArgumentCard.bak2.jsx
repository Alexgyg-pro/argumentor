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

  const cancelMove = () => {
    setIsMoveModalOpen(false);
  };

  const openReferenceModal = (reference) => {
    setSelectedReference(reference);
    setIsReferenceModalOpen(true);
  };

  useEffect(() => {
    const parents = getAllNodesExceptSubtree(
      argumentTree,
      argument.id,
      [],
      thesis?.text || ""
    );
    setPotentialParents(parents);
  }, [argumentTree, argument.id, thesis, getAllNodesExceptSubtree]);

  // MODE ÉDITION
  // if (isEditing) {
  //   return (
  //     <ArgumentEditForm
  //       argument={argument}
  //       onSave={handleSave}
  //       onCancel={handleCancel}
  //       references={references}
  //     />
  //   );
  // }

  // MODE AFFICHAGE - AVEC LE STYLE DE LA MAQUETTE
  return (
    <li
      className={styles.argumentCard}
      // style={{ marginLeft: `${depth * 20}px` }}
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

      {/* ⭐ AJOUTER : Rendu des enfants */}
      {/* {argument.children && argument.children.length > 0 && (
        <ul className={styles.childrenList}>
          {argument.children.map((child) => (
            <ArgumentCard
              key={child.id}
              argument={child}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              onAddChildArgument={onAddChildArgument}
              handleMoveArgument={handleMoveArgument}
              getAllNodesExceptSubtree={getAllNodesExceptSubtree}
              argumentTree={argumentTree}
              getArgumentCode={getArgumentCode}
              thesis={thesis}
              references={references}
              depth={depth + 1}
            />
          ))}
        </ul>
      )} */}

      {/* Rendu des enfants */}
      {argument.children && argument.children.length > 0 && (
        <div className={styles.childrenContainer}>
          {argument.children.map((child) => (
            <ArgumentCard
              key={child.id}
              argument={child}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              onAddChildArgument={onAddChildArgument}
              handleMoveArgument={handleMoveArgument}
              getAllNodesExceptSubtree={getAllNodesExceptSubtree}
              argumentTree={argumentTree}
              getArgumentCode={getArgumentCode}
              thesis={thesis}
              references={references}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* MODALE D'ÉDITION */}
      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {argument.isTemporary || !argument.text
                ? "Nouvel argument"
                : `Modifier l'argument [${getArgumentCode?.(argument.id)}]`}
            </h2>

            <ArgumentEditForm
              argument={argument}
              onSave={(newProperties) => {
                onEditArgument(argument.id, newProperties);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
              references={references}
            />
          </div>
        </div>
      )}

      {/* MODALE DE DÉPLACEMENT */}
      {isMoveModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Déplacer "{argument.text}"</h3>

            {potentialParents.length === 0 ? (
              <p>
                Impossible de déplacer cet argument. Aucun autre parent
                disponible.
              </p>
            ) : (
              <>
                <p>Choisir le nouveau parent :</p>
                <select
                  value={selectedNewParentId}
                  onChange={(e) => setSelectedNewParentId(e.target.value)}
                >
                  {potentialParents
                    .sort((a, b) => {
                      if (a.id === "root") return -1;
                      if (b.id === "root") return 1;
                      return a.id.localeCompare(b.id);
                    })
                    .map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.id === "root"
                          ? `#RACINE - ${thesis.text || "Thèse principale"}`
                          : `#${parent.id.replace("arg", "")} - ${parent.text}`}
                      </option>
                    ))}
                </select>
                <div className={styles.modalActions}>
                  <button onClick={confirmMove}>Déplacer</button>
                  <button onClick={cancelMove}>Annuler</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modales (garder le code existant d'ArgumentItem) */}
      {isExplanationModalOpen && (
        <div className="modal">{/* ... code modale explication ... */}</div>
      )}

      {/* ... autres modales ... */}
    </li>
  );
}
