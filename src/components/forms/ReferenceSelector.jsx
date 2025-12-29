// src/components/forms/ReferenceSelector.jsx
import { useState, useEffect } from "react";
import styles from "./Forms.module.css";

export function ReferenceSelector({
  allReferences = [],
  selectedRefIds = [],
  onChange,
  disabled = false,
}) {
  const [availableRefs, setAvailableRefs] = useState([]);
  const [selectedRefs, setSelectedRefs] = useState([]);
  const [selectedAvailableIds, setSelectedAvailableIds] = useState([]);
  const [selectedSelectedIds, setSelectedSelectedIds] = useState([]);

  // Effet SEULEMENT pour initialiser les listes
  useEffect(() => {
    // Références disponibles = toutes sauf celles déjà sélectionnées
    const available = allReferences.filter(
      (ref) => !selectedRefIds.includes(ref.id)
    );

    // Références sélectionnées = celles dont l'ID est dans selectedRefIds
    const selected = allReferences.filter((ref) =>
      selectedRefIds.includes(ref.id)
    );

    setAvailableRefs(available);
    setSelectedRefs(selected);
    setSelectedAvailableIds([]); // Réinitialiser la sélection
    setSelectedSelectedIds([]); // Réinitialiser la sélection
  }, [allReferences, selectedRefIds]);

  // === ACTIONS DE DÉPLACEMENT ===

  const moveSelectedToRight = () => {
    console.log("moveSelectedToRight", {
      selectedAvailableIds,
      availableRefsCount: availableRefs.length,
    });
    if (selectedAvailableIds.length === 0) {
      console.log("Aucune sélection");
      return;
    }

    // Filtrer les références sélectionnées
    const refsToMove = availableRefs.filter((ref) =>
      selectedAvailableIds.includes(ref.id)
    );

    // Nouvelles listes
    const newAvailable = availableRefs.filter(
      (ref) => !selectedAvailableIds.includes(ref.id)
    );
    const newSelected = [...selectedRefs, ...refsToMove];

    console.log(
      "Nouveaux available:",
      newAvailable.map((r) => r.id)
    );
    console.log(
      "Nouveaux selected:",
      newSelected.map((r) => r.id)
    );

    setAvailableRefs(newAvailable);
    setSelectedRefs(newSelected);
    setSelectedAvailableIds([]);
    onChange(newSelected.map((r) => r.id));
  };

  const moveSelectedToLeft = () => {
    console.log("moveSelectedToLeft", {
      selectedSelectedIds,
      selectedRefsCount: selectedRefs.length,
    });
    if (selectedSelectedIds.length === 0) return;

    // Filtrer les références sélectionnées
    const refsToMove = selectedRefs.filter((ref) =>
      selectedSelectedIds.includes(ref.id)
    );

    // Nouvelles listes
    const newSelected = selectedRefs.filter(
      (ref) => !selectedSelectedIds.includes(ref.id)
    );
    const newAvailable = [...availableRefs, ...refsToMove];

    setSelectedRefs(newSelected);
    setAvailableRefs(newAvailable);
    setSelectedSelectedIds([]);
    onChange(newSelected.map((r) => r.id));
  };

  const moveAllToRight = () => {
    console.log("moveAllToRight", { availableRefsCount: availableRefs.length });
    if (availableRefs.length === 0) return;

    const newSelected = [...selectedRefs, ...availableRefs];
    setSelectedRefs(newSelected);
    setAvailableRefs([]);
    setSelectedAvailableIds([]);
    onChange(newSelected.map((r) => r.id));
  };

  const moveAllToLeft = () => {
    console.log("moveAllToLeft", { selectedRefsCount: selectedRefs.length });
    if (selectedRefs.length === 0) return;

    const newAvailable = [...availableRefs, ...selectedRefs];
    setAvailableRefs(newAvailable);
    setSelectedRefs([]);
    setSelectedSelectedIds([]);
    onChange([]);
  };

  // === GESTION DU DOUBLE-CLIC ===

  const handleDoubleClickAvailable = (refId) => {
    console.log("handleDoubleClickAvailable", refId);
    const ref = availableRefs.find((r) => r.id === refId);
    if (ref) {
      const newAvailable = availableRefs.filter((r) => r.id !== refId);
      const newSelected = [...selectedRefs, ref];

      setAvailableRefs(newAvailable);
      setSelectedRefs(newSelected);
      setSelectedAvailableIds([]);
      onChange(newSelected.map((r) => r.id));
    }
  };

  const handleDoubleClickSelected = (refId) => {
    console.log("handleDoubleClickSelected", refId);
    const ref = selectedRefs.find((r) => r.id === refId);
    if (ref) {
      const newSelected = selectedRefs.filter((r) => r.id !== refId);
      const newAvailable = [...availableRefs, ref];

      setSelectedRefs(newSelected);
      setAvailableRefs(newAvailable);
      setSelectedSelectedIds([]);
      onChange(newSelected.map((r) => r.id));
    }
  };

  return (
    <div className={styles.referenceSelector}>
      {/* COLONNE GAUCHE - Références disponibles */}
      <div className={styles.selectorColumn}>
        <div className={styles.selectorHeader}>
          <label className={styles.selectorLabel}>
            Références disponibles ({availableRefs.length})
          </label>
        </div>

        <select
          multiple
          className={styles.selectorList}
          value={selectedAvailableIds}
          onChange={(e) => {
            const values = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setSelectedAvailableIds(values);
            setSelectedSelectedIds([]); // Désélectionner l'autre liste
          }}
          onDoubleClick={(e) => {
            const refId = e.target.value;
            if (refId) handleDoubleClickAvailable(refId);
          }}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "default",
            width: "100%",
            height: "300px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "8px",
          }}
        >
          {availableRefs.map((ref) => (
            <option key={ref.id} value={ref.id}>
              [{ref.id}] {ref.title}
            </option>
          ))}
          {availableRefs.length === 0 && (
            <option disabled>Aucune référence disponible</option>
          )}
        </select>

        {selectedAvailableIds.length > 0 && (
          <div className={styles.selectionInfo}>
            {selectedAvailableIds.length} élément(s) sélectionné(s)
          </div>
        )}
      </div>

      {/* BOUTONS CENTRAUX */}
      <div className={styles.selectorActions}>
        <button
          type="button"
          onClick={moveAllToRight}
          disabled={disabled || availableRefs.length === 0}
          title="Ajouter toutes les références"
        >
          ≫
        </button>
        <button
          type="button"
          onClick={moveSelectedToRight}
          disabled={disabled || selectedAvailableIds.length === 0}
          title="Ajouter la sélection"
        >
          &gt;
        </button>
        <button
          type="button"
          onClick={moveSelectedToLeft}
          disabled={disabled || selectedSelectedIds.length === 0}
          title="Retirer la sélection"
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={moveAllToLeft}
          disabled={disabled || selectedRefs.length === 0}
          title="Retirer toutes les références"
        >
          ≪
        </button>
      </div>

      {/* COLONNE DROITE - Références associées */}
      <div className={styles.selectorColumn}>
        <div className={styles.selectorHeader}>
          <label className={styles.selectorLabel}>
            Références associées ({selectedRefs.length})
          </label>
        </div>

        <select
          multiple
          className={styles.selectorList}
          value={selectedSelectedIds}
          onChange={(e) => {
            const values = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setSelectedSelectedIds(values);
            setSelectedAvailableIds([]); // Désélectionner l'autre liste
          }}
          onDoubleClick={(e) => {
            const refId = e.target.value;
            if (refId) handleDoubleClickSelected(refId);
          }}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "default",
            width: "100%",
            height: "300px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "8px",
          }}
        >
          {selectedRefs.map((ref) => (
            <option key={ref.id} value={ref.id}>
              [{ref.id}] {ref.title}
            </option>
          ))}
          {selectedRefs.length === 0 && (
            <option disabled>Aucune référence associée</option>
          )}
        </select>

        {selectedSelectedIds.length > 0 && (
          <div className={styles.selectionInfo}>
            {selectedSelectedIds.length} élément(s) sélectionné(s)
          </div>
        )}
      </div>
    </div>
  );
}
