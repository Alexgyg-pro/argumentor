import { useState, useEffect } from "react"; // <-- IMPORT CRUCIAL ICI
import { ArgumentEditForm } from "./ArgumentEditForm";

export function ArgumentItem({
  argument,
  onEditArgument,
  onDeleteArgument,
  onAddChildArgument,
  getAllNodesExceptSubtree, // Nouvelles props
  handleMoveArgument,
  argumentTree, // On a besoin de l'arbre pour lister les parents
  getArgumentCode,
  thesis = {},
  depth = 0,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  // State pour gérer la modale de déplacement
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedNewParentId, setSelectedNewParentId] = useState("");

  const [potentialParents, setPotentialParents] = useState([]);

  // const handleDoubleClick = () => {
  //   setEditingId(argument.id);
  //   setEditText(argument.text);
  // };

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
    // On s'aligne sur le nom du paramètre
    onEditArgument(argument.id, newProperties); // Utilise 'newProperties'
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsEditing(false);
  };

  const handleMoveClick = () => {
    setIsMoveModalOpen(true);
    setSelectedNewParentId(argument.parentId); // Sélectionne le parent actuel par défaut
  };

  const confirmMove = () => {
    if (selectedNewParentId) {
      // const numericParentId = parseInt(selectedNewParentId, 10);
      // handleMoveArgument(argument.id, numericParentId);
      handleMoveArgument(argument.id, selectedNewParentId);
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
        <div>
          <strong>
            {!isEditing &&
              getArgumentCode &&
              `[${getArgumentCode(argument.id)}] `}
            {argument.text}
          </strong>
          <button onClick={() => setIsEditing(true)}>✏️</button>
          <button onClick={() => onDeleteArgument(argument.id)}>🗑️</button>
          <button onClick={() => onAddChildArgument(argument.id)}>➕</button>
          <button onClick={handleMoveClick}>↔️ Déplacer</button>
          <br />
          <small>
            Causa: {argument.causa} | Forma: {argument.forma}
            {argument.validity !== undefined &&
              ` | Validité: ${argument.validity.toFixed(1)}`}
            {argument.relevance !== undefined &&
              ` | Pertinence: ${argument.relevance.toFixed(1)}`}
            {argument.value !== undefined &&
              ` | Valeur: ${argument.value.toFixed(1)}`}
            {argument.natura && ` | Natura: ${argument.natura}`}
          </small>
        </div>
      )}

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
              getArgumentCode={getArgumentCode}
              thesis={thesis}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

      {isMoveModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Déplacer "{argument.text}"</h3>

            {potentialParents.length === 0 ? (
              <p>
                Impossible de déplacer cet argument. Aucun autre parent
                disponible (il ne peut pas être son propre descendant).
              </p>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </li>
  );
}
