// ExportButton devient beaucoup plus simple
export function ExportButton({ handleExport, proposition }) {
  return (
    <button onClick={handleExport} disabled={!proposition}>
      💾 Exporter en JSON
    </button>
  );
}
