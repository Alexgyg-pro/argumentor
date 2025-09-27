import { useState, useEffect } from "react";

export function ThesisEditor({ thesis, onSave, onCancel }) {
  const [localThesis, setLocalThesis] = useState(thesis);

  useEffect(() => {
    setLocalThesis(thesis);
  }, [thesis]);

  const handleSave = () => {
    onSave(localThesis);
  };

  const handleFieldChange = (field, value) => {
    setLocalThesis((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="thesis-editor bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-bold mb-3">Édition de la thèse</h3>

      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Votre thèse principale :</span>
          <textarea
            value={localThesis.text}
            onChange={(e) => handleFieldChange("text", e.target.value)}
            placeholder="Énoncez votre proposition principale..."
            rows="3"
            className="w-full p-2 border rounded mt-1"
            autoFocus
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Forme logique :</span>
          <select
            value={localThesis.forma}
            onChange={(e) => handleFieldChange("forma", e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="descriptif">Descriptif</option>
            <option value="normatif">Normatif</option>
            <option disabled value="esthétique">
              Esthétique (bientôt disponible)
            </option>
          </select>
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            💾 Sauvegarder
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ✗ Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
