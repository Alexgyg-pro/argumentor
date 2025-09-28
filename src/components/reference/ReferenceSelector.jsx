import { useState, useEffect } from "react";
import styles from "./ReferenceSelector.module.css";

export function ReferenceSelector({
  references,
  selectedReferences,
  onChange,
}) {
  const [availableRefs, setAvailableRefs] = useState([]);
  const [selectedRefs, setSelectedRefs] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssociated, setSelectedAssociated] = useState([]);

  // Initialisation
  useEffect(() => {
    const available = references.filter(
      (ref) => !selectedReferences.includes(ref.id)
    );
    const selected = references.filter((ref) =>
      selectedReferences.includes(ref.id)
    );
    setAvailableRefs(available);
    setSelectedRefs(selected);
  }, [references, selectedReferences]);

  const addReference = (refId) => {
    const ref = availableRefs.find((r) => r.id === refId);
    if (ref) {
      setAvailableRefs(availableRefs.filter((r) => r.id !== refId));
      setSelectedRefs([...selectedRefs, ref]);
      setSelectedAvailable(""); // Reset selection
      onChange([...selectedRefs, ref].map((r) => r.id));
    }
  };

  const removeReference = (refId) => {
    const ref = selectedRefs.find((r) => r.id === refId);
    if (ref) {
      setSelectedRefs(selectedRefs.filter((r) => r.id !== refId));
      setAvailableRefs([...availableRefs, ref]);
      setSelectedAssociated(""); // Reset selection
      onChange(selectedRefs.filter((r) => r.id !== refId).map((r) => r.id));
    }
  };

  const addAll = () => {
    const allRefs = availableRefs.map((ref) => ref.id);
    setSelectedRefs([...selectedRefs, ...availableRefs]);
    setAvailableRefs([]);
    setSelectedAvailable([]);
    onChange([...selectedRefs, ...availableRefs].map((r) => r.id));
  };

  const removeAll = () => {
    setAvailableRefs([...availableRefs, ...selectedRefs]);
    setSelectedRefs([]);
    setSelectedAssociated([]);
    onChange([]);
  };

  const addSelected = () => {
    if (selectedAvailable.length > 0) {
      selectedAvailable.forEach((refId) => addReference(refId));
      setSelectedAvailable([]); // Reset selection
    }
  };

  const removeSelected = () => {
    if (selectedAssociated.length > 0) {
      selectedAssociated.forEach((refId) => removeReference(refId));
      setSelectedAssociated([]); // Reset selection
    }
  };

  return (
    <div className={styles.referenceSelector}>
      <div className={styles.selectorSection}>
        <h4>Références disponibles ({availableRefs.length})</h4>
        <select
          multiple
          size="8"
          className={styles.listBox}
          value={selectedAvailable}
          onChange={(e) => {
            const values = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setSelectedAvailable(values);
          }}
          onDoubleClick={(e) => {
            const refId = e.target.value;
            if (refId) addReference(refId);
          }}
        >
          {availableRefs.map((ref) => (
            <option key={ref.id} value={ref.id}>
              {ref.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controlButtons}>
        <button
          onClick={(e) => {
            e.preventDefault();
            addAll();
          }}
          title="Ajouter toutes"
        >
          ⇨
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            removeAll();
          }}
          title="Retirer toutes"
        >
          ⇦
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            addSelected();
          }}
          title="Ajouter sélectionnée"
        >
          →
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            removeSelected();
          }}
          title="Retirer sélectionnée"
        >
          ←
        </button>
      </div>

      <div className={styles.selectorSection}>
        <h4>Références associées ({selectedRefs.length})</h4>
        <select
          multiple
          size="8"
          className={styles.listBox}
          value={selectedAssociated}
          onChange={(e) => {
            const values = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setSelectedAssociated(values);
          }}
          onDoubleClick={(e) => {
            const refId = e.target.value;
            if (refId) removeReference(refId);
          }}
        >
          {selectedRefs.map((ref) => (
            <option key={ref.id} value={ref.id}>
              {ref.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
