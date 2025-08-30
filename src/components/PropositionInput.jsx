import { useState } from 'react';

export function PropositionInput({ onPropositionChange }) {
  const [proposition, setProposition] = useState('');

  const handleChange = (event) => {
    const newValue = event.target.value;
    setProposition(newValue);
    // Si la prop est fournie, on prévient le parent du changement
    if (onPropositionChange) {
      onPropositionChange(newValue);
    }
  };

  return (
    <div className="proposition-input">
      <label htmlFor="proposition">Votre proposition principale :</label>
      <input
        type="text"
        id="proposition"
        value={proposition}
        onChange={handleChange}
        placeholder="Entrez votre proposition principale..."
        className="proposition-field"
      />
    </div>
  );
}