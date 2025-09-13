// ExportButton.jsx
export function ExportButton({ handleExport, thesis }) {
  return (
    <button onClick={handleExport} disabled={!thesis?.text}>
      💾 Exporter en JSON
    </button>
  );
}
