// src/utils/definitionUtils.js
export function getNextDefinitionId(definitions) {
  if (!Array.isArray(definitions) || definitions.length === 0) {
    return "def00001";
  }

  const maxId = definitions.reduce((max, def) => {
    const match = def.id?.match(/^def(\d{5})$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 0);

  return `def${String(maxId + 1).padStart(5, "0")}`;
}
