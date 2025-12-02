import { DefinitionForm } from "../forms/DefinitionForm";

export function DefinitionsList({ onAddDefinition = false }) {
  return (
    <div>
      {false ? (
        <p>Aucun argument pour le moment.</p>
      ) : (
        <ul>
          <li>Définition 1</li>
          <li>Définition 2</li>
          <li>Définition 3</li>
        </ul>
      )}
      {onAddDefinition && <DefinitionForm />}
    </div>
  );
}
