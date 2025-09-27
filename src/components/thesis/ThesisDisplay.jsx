export function ThesisDisplay({ thesis, onEdit }) {
  return (
    <div className="bg-white min-w-65p p-5">
      <h2 className="text-2xl font-bold mb-2">{thesis.text}</h2>
      <p className="text-gray-600 mb-4">Thèse {thesis.forma}</p>

      <button
        onClick={onEdit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {thesis.text ? "✏️ Modifier" : "➕ Définir la thèse"}
      </button>
    </div>
  );
}
