// ArgumentEditForm.jsx
import { useState, useEffect } from "react";

export function ArgumentEditForm({
  argument,
  onSave,
  onCancel,
  references = [],
}) {
  const [text, setText] = useState(argument.text);
  const [textComment, setTextComment] = useState(argument.textComment || "");
  const [causa, setCausa] = useState(argument.causa);
  const [forma, setForma] = useState(argument.forma || "descriptif");
  const [validity, setValidity] = useState(argument.validity ?? 0.5);
  const [relevance, setRelevance] = useState(argument.relevance ?? 0.5);
  const [value, setValue] = useState((argument.value ?? 0.5).toFixed(2));
  const [natura, setNatura] = useState(argument.natura || "validity");
  const [selectedReferenceIds, setSelectedReferenceIds] = useState(
    argument.references || []
  );

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // On rassemble toutes les propriétés modifiées dans un objet
    onSave({
      text: text,
      textComment: textComment,
      causa: causa,
      forma: forma,
      validity: validity,
      relevance: relevance,
      natura: natura,
      value: parseFloat(value),
      references: selectedReferenceIds,
    });
  };

  const handleReferenceToggle = (referenceId) => {
    setSelectedReferenceIds(
      (prev) =>
        prev.includes(referenceId)
          ? prev.filter((id) => id !== referenceId) // Désélectionner
          : [...prev, referenceId] // Sélectionner
    );
  };

  return (
    <form onSubmit={handleSubmit} className="argument-edit-form">
      <label>
        Énoncé:
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
      </label>
      <label>
        Commentaire de texte :
        <textarea
          value={textComment}
          onChange={(e) => setTextComment(e.target.value)}
          placeholder="Développez votre pensée, sources, précisions..."
          rows={4}
        />
      </label>
      {references && references.length > 0 && (
        <div className="references-selection">
          <label>
            <strong>📚 Références :</strong>
          </label>

          <div className="listboxes-container">
            {/* RÉFÉRENCES DISPONIBLES */}
            <div className="listbox-section">
              <label>Références disponibles :</label>
              <select multiple size="6" className="references-listbox">
                {references
                  .filter((ref) => !selectedReferenceIds.includes(ref.id))
                  .map((ref) => (
                    <option key={ref.id} value={ref.id}>
                      {ref.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* BOUTONS DE TRANSFERT */}
            <div className="transfer-buttons">
              <button
                type="button"
                onClick={() => {
                  const select = document.querySelector(".references-listbox");
                  const selectedId = select.value;
                  if (selectedId) {
                    setSelectedReferenceIds((prev) => [...prev, selectedId]);
                  }
                }}
              >
                ➡
              </button>
              <button
                type="button"
                onClick={() => {
                  const select = document.querySelector(".selected-listbox");
                  const selectedId = select.value;
                  if (selectedId) {
                    setSelectedReferenceIds((prev) =>
                      prev.filter((id) => id !== selectedId)
                    );
                  }
                }}
              >
                ⬅
              </button>
            </div>

            {/* RÉFÉRENCES SÉLECTIONNÉES */}
            <div className="listbox-section">
              <label>Références de cet argument :</label>
              <select multiple size="6" className="selected-listbox">
                {selectedReferenceIds.map((refId) => {
                  const ref = references.find((r) => r.id === refId);
                  return ref ? (
                    <option key={ref.id} value={ref.id}>
                      {ref.title}
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </div>

          <div className="selection-info">
            <small>
              {selectedReferenceIds.length} référence(s) sélectionnée(s)
            </small>
          </div>
        </div>
      )}
      <label>
        Type (Causa):
        <select value={causa} onChange={(e) => setCausa(e.target.value)}>
          <option value="neutralis">⏺️ Neutre</option>
          <option value="pro">✅ Pour</option>
          <option value="contra">❌ Contre</option>
        </select>
      </label>
      <label>
        Forme (Forma):
        <select value={forma} onChange={(e) => setForma(e.target.value)}>
          <option value="descriptif">Descriptif</option>
          <option value="normatif">Normatif</option>
          <option disabled value="esthétique">
            Esthétique (bientôt disponible)
          </option>
        </select>
      </label>
      {argument.children.length === 0 ? (
        <label>
          Valeur (0-1):
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        </label>
      ) : (
        <div>
          <p>Validité: {argument.validity?.toFixed(1)} (calculée)</p>
          <p>Pertinence: {argument.relevance?.toFixed(1)} (calculée)</p>
        </div>
      )}
      <label>
        Nature de l'argument :
        <select value={natura} onChange={(e) => setNatura(e.target.value)}>
          <option value="validity">Validité</option>
          <option value="relevance">Pertinence</option>
        </select>
      </label>
      <div className="form-actions">
        <button type="submit">Sauvegarder</button>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
