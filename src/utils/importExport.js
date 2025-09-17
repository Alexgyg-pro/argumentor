import { findNodeById } from "./argumentOperations";

export const normalizeArguments = (args = []) => {
  return arguments.map((arg) => ({
    ...arg,
    id: String(arg.id),
    parentId: arg.parentId ? String(arg.parentId) : "root",
    causa: arg.causa || "pro",
    validity: arg.validity ?? 0.5,
    relevance: arg.relevance ?? 0.5,
    children: arg.children || [],
  }));
};

export const exportArgumentaire = (thesis, argumentTree) => {
  return {
    thesis,
    arguments: argumentTree.children,
    version: "1.1",
  };
};

export const handleImport = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);
      callback(jsonData);
    } catch (error) {
      alert("Fichier JSON invalide");
    }
  };
  reader.readAsText(file);
};
