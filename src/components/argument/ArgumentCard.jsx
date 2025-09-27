export function ArgumentCard({
  argument,
  getArgumentCode,
  onEdit,
  onDelete,
  onAddChild,
  onMove,
}) {
  return (
    <li className="min-h-[50px] w-[750px] border border-black rounded-xl shadow-lg m-1 p-1 hover:bg-gray-100">
      <div className="argheader flex justify-between items-center">
        <div className="code font-bold" title="Code de l'argument">
          {getArgumentCode?.(argument.id)}
        </div>
        <div className="forma italic" title="Forma de l'argument">
          {argument.forma}
        </div>
        <div
          className="natura font-bold"
          title="Renforce ou affaibli l'argument parent"
        >
          {argument.natura}
        </div>
      </div>

      <p className="enonce ml-10 mt-1">
        #{argument.id.replace("arg", "")} - {argument.text}
      </p>

      <div className="argfoot flex justify-between items-center mt-2">
        <div className="text-sm">{argument.causa}</div>
        <div className="weight text-xs italic" title="Valeur de l'argument">
          Validité: {argument.validity?.toFixed(1)} - Pertinence:{" "}
          {argument.relevance?.toFixed(1)} - Poids: {argument.value?.toFixed(2)}
        </div>
        <div className="buttons flex justify-end gap-2.5">
          <button
            onClick={() => onEdit(argument.id)}
            title="Modifier l'argument"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(argument.id)}
            title="Supprimer l'argument"
          >
            🗑️
          </button>
          <button
            onClick={() => onAddChild(argument.id)}
            title="Ajouter un argument"
          >
            ➕
          </button>
          <button
            onClick={() => onMove(argument.id)}
            title="Déplacer l'argument"
          >
            ↔️
          </button>
        </div>
      </div>
    </li>
  );
}
