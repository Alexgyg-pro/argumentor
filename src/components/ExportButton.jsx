// ExportButton.jsx
export function ExportButton({ onExport, thesis }) {
  console.log("🔼 ExportButton cliqué");
  return (
    <button onClick={onExport} disabled={!thesis?.text}>
      💾 Exporter en JSON
    </button>
  );
}
