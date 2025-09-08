import { useState } from "react"; // <-- IMPORT CRUCIAL ICI
import { ArgumentEditForm } from "./ArgumentEditForm";

export function ArgumentItem({
  argument,
  onEditArgument,
  onDeleteArgument,
  onAddChildArgument,
  getAllNodesExceptSubtree, // Nouvelles props
  handleMoveArgument,
  argumentTree, // On a besoin de l'arbre pour lister les parents
  depth = 0,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  // State pour gérer la modale de déplacement
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedNewParentId, setSelectedNewParentId] = useState("");

  const handleDoubleClick = () => {
    setEditingId(argument.id);
    setEditText(argument.text);
  };

  const handleSave = (newProperties) => {
    // On s'aligne sur le nom du paramètre
    onEditArgument(argument.id, newProperties); // Utilise 'newProperties'
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleMoveClick = () => {
    setIsMoveModalOpen(true);
    setSelectedNewParentId(argument.parentId); // Sélectionne le parent actuel par défaut
  };

  const confirmMove = () => {
    if (selectedNewParentId) {
      const numericParentId = parseInt(selectedNewParentId, 10);
      handleMoveArgument(argument.id, numericParentId);
    }
    setIsMoveModalOpen(false);
  };

  const cancelMove = () => {
    setIsMoveModalOpen(false);
  };

  // Récupère la liste des parents possibles
  // const potentialParents = getAllNodesExceptSubtree(argumentTree, argument.id);

  return (
    <li style={{ marginLeft: `${depth * 20}px` }}>
      {isEditing ? (
        <ArgumentEditForm
          argument={argument}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        /* Sinon, on affiche la vue normale */
        <div>
          <strong>{argument.text}</strong>
          {/* Bouton pour éditer */}
          <button onClick={() => setIsEditing(true)}>✏️</button>
          {/* Bouton pour supprimer */}
          <button onClick={() => onDeleteArgument(argument.id)}>🗑️</button>
          {/* Bouton pour ajouter un enfant (futur) */}
          <button onClick={() => onAddChildArgument(argument.id)}>➕</button>
          <br />
          <small>
            Causa: {argument.causa} | Poids: {argument.weight}
            {/* Affichera aussi forma plus tard */}
          </small>
        </div>
      )}

      {/* Rendu récursif des enfants */}
      {argument.children && argument.children.length > 0 && (
        <ul>
          {argument.children.map((child) => (
            <ArgumentItem
              key={child.id}
              argument={child}
              onEditArgument={onEditArgument}
              onDeleteArgument={onDeleteArgument}
              onAddChildArgument={onAddChildArgument}
              getAllNodesExceptSubtree={getAllNodesExceptSubtree}
              handleMoveArgument={handleMoveArgument}
              argumentTree={argumentTree}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

      {/* Modale de déplacement */}
      {isMoveModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Déplacer "{argument.text}"</h3>

            {/* CALCULE la liste ici */}
            {(() => {
              const potentialParents = getAllNodesExceptSubtree(
                argumentTree,
                argument.id
              );

              if (potentialParents.length === 0) {
                // CAS WHERE NO VALID PARENTS EXIST
                return (
                  <p>
                    Impossible de déplacer cet argument. Aucun autre parent
                    disponible (il ne peut pas être son propre descendant).
                  </p>
                );
              } else {
                // CAS NORMAL
                return (
                  <>
                    <p>Choisir le nouveau parent :</p>
                    <select
                      value={selectedNewParentId}
                      onChange={(e) => setSelectedNewParentId(e.target.value)}
                    >
                      {potentialParents.map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.text}
                        </option>
                      ))}
                    </select>
                    <div style={{ marginTop: "1rem" }}>
                      <button onClick={confirmMove}>Déplacer</button>
                      <button onClick={cancelMove}>Annuler</button>
                    </div>
                  </>
                );
              }
            })()}
          </div>
        </div>
      )}
    </li>
  );
}
