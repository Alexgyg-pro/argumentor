import { findNodeById } from "./argumentOperations";

// export const normalizeArguments = (args = []) => {
//   return arguments.map((arg) => ({
//     ...arg,
//     id: String(arg.id),
//     parentId: arg.parentId ? String(arg.parentId) : "root",
//     causa: arg.causa || "pro",
//     validity: arg.validity ?? 0.5,
//     relevance: arg.relevance ?? 0.5,
//     children: arg.children || [],
//   }));
// };

export const normalizeArguments = (args = []) => {
  console.log("🔄 NORMALIZATION - Input:", args);

  const normalized = args.map((arg) => ({
    ...arg,
    id: String(arg.id),
    parentId: arg.parentId ? String(arg.parentId) : "root",
    causa: arg.causa || "pro", // ou "neutralis" ?
    validity: arg.validity ?? 0.5,
    relevance: arg.relevance ?? 0.5,
    children: arg.children || [],
  }));

  console.log("🔄 NORMALIZATION - Output:", normalized);
  return normalized;
};

export const exportArgumentaire = (thesis, argumentTree, references) => {
  const cleanArgument = (arg) => {
    const { isTemporary, ...cleanArg } = arg; // ← Exclure isTemporary
    if (cleanArg.children) {
      cleanArg.children = cleanArg.children.map(cleanArgument);
    }
    return cleanArg;
  };

  return {
    thesis: {
      text: thesis.text,
      forma: thesis.forma,
    },
    arguments: argumentTree.children.map(cleanArgument),
    references: references || [],
    version: "1.2",
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
