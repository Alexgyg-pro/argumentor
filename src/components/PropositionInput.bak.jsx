export function PropositionInput({ value, onValueChange }) {
  // Ce fichier est normalement appelé à disparaitre bientôt, remplacé par ThesisInput.jsx
  // car on gère maintenant un objet "thesis" plus complexe.
  // Mais pour l'instant, on le garde simple.
  const handleChange = (event) => {
    const newValue = event.target.value;
    onValueChange(newValue); // On renvoie la nouvelle valeur au parent
  };

  return (
    <div className="proposition-input">
      <label htmlFor="proposition">Votre proposition principale :</label>
      <input
        type="text"
        id="proposition"
        value={value} // On utilise la prop `value` venue du parent
        onChange={handleChange}
        placeholder="Entrez votre proposition principale..."
        className="proposition-field"
      />
    </div>
  );
}
