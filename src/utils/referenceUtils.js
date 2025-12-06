export function getNextReferenceId(references) {
  if (references.length === 0) return "ref00001";
  const maxId = references.reduce((max, ref) => {
    const num = parseInt(ref.id.replace("ref", ""));
    return num > max ? num : max;
  }, 0);
  return `ref${String(maxId + 1).padStart(5, "0")}`;
}
