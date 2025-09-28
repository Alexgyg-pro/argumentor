// scr/components/ArgumentItem.jsx
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
  references,
  depth = 0,
}) {
  const [isEditing, setIsEditing] = useState(
    !argument.text || argument.text === "Nouvel argument"
  );
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  // State pour gérer la modale de déplacement
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedNewParentId, setSelectedNewParentId] = useState("");
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false); // ← NOUVEAU
  const [selectedReference, setSelectedReference] = useState(null); // ← NOUVEAU
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

    const sortedParents = potentialParents.sort((a, b) => {
      if (a.id === "root") return -1; // La thèse toujours en premier
      if (b.id === "root") return 1;

      const codeA = getArgumentCode(a.id) || "";
      const codeB = getArgumentCode(b.id) || "";

      return codeA.localeCompare(codeB);
    });
  }, [argumentTree, argument.id, thesis, getAllNodesExceptSubtree]);

  const handleSave = (newProperties) => {
    // On s'aligne sur le nom du paramètre
    onEditArgument(argument.id, newProperties); // Utilise 'newProperties'
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (argument.isTemporary && !argument.text.trim()) {
      // SUPPRIMER les arguments temporaires annulés
      onDeleteArgument(argument.id);
    } else {
      // Reset sans supprimer pour les existants
      setIsEditing(false);
    }
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

  // FONCTION POUR OUVRIRE UNE RÉFÉRENCE
  const openReferenceModal = (reference) => {
    setSelectedReference(reference);
    setIsReferenceModalOpen(true);
  };

  return (
    <li style={{ marginLeft: `${depth * 20}px` }}>
      {isEditing ? (
        <ArgumentEditForm
          argument={argument}
          onSave={handleSave}
          onCancel={handleCancel}
          references={references}
        />
      ) : (
        <div>
          <strong>
            {!isEditing &&
              getArgumentCode &&
              `[${getArgumentCode(argument.id)}] `}
            <div
              onClick={() => setIsExplanationModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <strong>
                [{getArgumentCode(argument.id)}] {argument.text}
              </strong>
            </div>{" "}
          </strong>
          <button onClick={() => setIsEditing(true)}>✏️</button>
          <button onClick={() => onDeleteArgument(argument.id)}>🗑️</button>
          <button onClick={() => onAddChildArgument(argument.id)}>➕</button>
          <button onClick={handleMoveClick}>↔️ Déplacer</button>
          <br />
          <small>
            ID: #{argument.id.replace("arg", "")} | Causa: {argument.causa} |
            Forma: {argument.forma}
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

      {isExplanationModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Explication détaillée</h3>
            <p>
              <strong>Énoncé :</strong> {argument.text}
            </p>
            <p>
              <strong>Explication :</strong>{" "}
              {argument.textComment || "Aucune explication fournie."}
            </p>

            {/* NOUVEAU : AFFICHAGE DES RÉFÉRENCES */}
            {argument.references && argument.references.length > 0 && (
              <div className="argument-references">
                <strong>Références citées :</strong>
                {argument.references.map((refId) => {
                  const ref = references.find((r) => r.id === refId);
                  return ref ? (
                    <div key={ref.id} className="reference-link">
                      <button
                        onClick={() => openReferenceModal(ref)}
                        className="reference-button"
                      >
                        📚 {ref.title}
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            <button onClick={() => setIsExplanationModalOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* NOUVELLE MODALE DE RÉFÉRENCE */}
      {isReferenceModalOpen && selectedReference && (
        <div className="modal">
          <div className="modal-content">
            <h3>Référence : {selectedReference.title}</h3>
            <div className="reference-content">
              {selectedReference.content || "Aucun contenu détaillé."}
            </div>
            <button onClick={() => setIsReferenceModalOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
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
                  {potentialParents
                    .sort((a, b) => {
                      if (a.id === "root") return -1;
                      if (b.id === "root") return 1;
                      return a.id.localeCompare(b.id); // ← Tri alphabétique naturel
                    })
                    .map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.id === "root"
                          ? `#RACINE - ${thesis.text || "Thèse principale"}`
                          : `#${parent.id.replace("arg", "")} - ${parent.text}`}
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
