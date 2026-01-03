// src/components/pdf/PdfDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

// ========== STYLES ==========
const styles = StyleSheet.create({
  // Layout principal
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.4,
  },

  // Contrôle de pagination
  keepTogether: {
    breakInside: "avoid",
  },
  noBreak: {
    minPresenceAhead: 2, // Garde au moins 2 lignes ensemble
  },

  // En-tête
  header: {
    marginBottom: 30,
    textAlign: "center",
    borderBottom: "1pt solid #ecf0f1",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 10,
  },

  // Sections
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#34495e",
    borderBottom: "2pt solid #3498db",
    paddingBottom: 5,
  },

  // Thèse
  thesis: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: "italic",
    color: "#2c3e50",
    lineHeight: 1.5,
  },
  context: {
    fontSize: 14,
    marginBottom: 15,
    color: "#546e7a",
    lineHeight: 1.4,
  },
  metadata: {
    fontSize: 11,
    color: "#95a5a6",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "0.5pt solid #ecf0f1",
  },

  // Arguments (sommaire)
  argumentItem: {
    marginBottom: 8,
  },
  argumentCode: {
    fontWeight: "bold",
    marginRight: 8,
  },
  // Couleurs selon le type
  proCode: {
    color: "#27ae60", // Vert pour Pour
  },
  contraCode: {
    color: "#e74c3c", // Rouge pour Contre
  },
  neutralCode: {
    color: "#7f8c8d", // Gris pour Neutre
  },

  // Liens
  link: {
    color: "#3498db",
    textDecoration: "none",
  },
  backLink: {
    fontSize: 10,
    color: "#95a5a6",
    marginTop: 3,
  },

  // Détails d'arguments
  argumentDetails: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderLeft: "3pt solid #3498db",
  },
  argumentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  argumentMeta: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  argumentComment: {
    fontSize: 11,
    color: "#546e7a",
    fontStyle: "italic",
    marginBottom: 10,
    paddingLeft: 10,
    borderLeft: "2pt solid #bdc3c7",
  },

  // Références dans les arguments
  referencesSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "0.5pt dashed #bdc3c7",
  },
  referencesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 5,
  },
  referenceLink: {
    fontSize: 11,
    color: "#2980b9",
    marginBottom: 3,
  },

  // Définitions
  definitionItem: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  definitionTerm: {
    fontWeight: "bold",
    color: "#2c3e50",
  },

  // Section références
  referenceItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: "0.5pt solid #ecf0f1",
  },
  referenceHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 3,
  },
  referenceContent: {
    fontSize: 11,
    color: "#7f8c8d",
    marginTop: 5,
    lineHeight: 1.3,
  },

  // Pied de page
  footer: {
    fontSize: 10,
    color: "#bdc3c7",
    textAlign: "center",
    marginTop: 30,
    paddingTop: 10,
    borderTop: "0.5pt solid #ecf0f1",
  },
});

// ========== COMPOSANTS ==========

// Helper pour la couleur du code
// const getCodeStyle = (causa) => {
//   switch (causa) {
//     case "pro":
//       return styles.proCode;
//     case "contra":
//       return styles.contraCode;
//     default:
//       return styles.neutralCode;
//   }
// };

// Fonction helper pour la couleur
const getCodeStyle = (argument, getArgumentColor) => {
  if (getArgumentColor && typeof getArgumentColor === "function") {
    const color = getArgumentColor(argument.id);
    switch (color) {
      case "blue":
        return styles.proCode;
      case "red":
        return styles.contraCode;
      case "gray":
        return styles.neutralCode;
      default:
        // Fallback sur causa
        return getCodeStyleByCausa(argument.causa);
    }
  } else {
    return getCodeStyleByCausa(argument.causa);
  }
};

const getCodeStyleByCausa = (causa) => {
  switch (causa) {
    case "pro":
      return styles.proCode;
    case "contra":
      return styles.contraCode;
    default:
      return styles.neutralCode;
  }
};

// Composant récursif pour les arguments (sommaire)
const ArgumentPdfNode = ({
  argument,
  depth,
  getArgumentCode,
  getArgumentColor,
}) => {
  const code = getArgumentCode ? getArgumentCode(argument.id) : argument.id;

  return (
    <View
      style={[styles.keepTogether, { marginLeft: depth * 15, marginBottom: 6 }]}
    >
      <Text style={[styles.argumentItem, styles.noBreak]}>
        <Text
          style={[
            styles.argumentCode,
            getCodeStyle(argument, getArgumentColor),
          ]}
        >
          {code}
        </Text>
        <Link src={`#arg-${argument.id}`} style={styles.link}>
          {argument.claim}
        </Link>
      </Text>
      {argument.children?.map((child) => (
        <ArgumentPdfNode
          key={child.id}
          argument={child}
          depth={depth + 1}
          getArgumentCode={getArgumentCode}
          getArgumentColor={getArgumentColor}
        />
      ))}
    </View>
  );
};

// Composant pour les détails d'arguments
const ArgumentDetails = ({
  argument,
  getArgumentCode,
  getArgumentColor,
  references = [],
}) => {
  const code = getArgumentCode ? getArgumentCode(argument.id) : argument.id;

  // Références associées à cet argument
  const argumentRefs = references.filter((ref) =>
    argument.references?.includes(ref.id)
  );

  return (
    <View
      style={[styles.argumentDetails, styles.keepTogether]}
      id={`arg-${argument.id}`}
    >
      {/* Titre avec code coloré */}
      <Text style={styles.argumentTitle}>
        <Text style={getCodeStyle(argument, getArgumentColor)}>{code}</Text> -{" "}
        {argument.claim}
        {argument.claim}
      </Text>

      {/* Métadonnées */}
      <Text style={styles.argumentMeta}>
        Type:{" "}
        {argument.causa === "pro"
          ? "Pour"
          : argument.causa === "contra"
          ? "Contre"
          : "Neutre"}{" "}
        | Forme: {argument.forma} | Validité: {argument.validity} | Pertinence:{" "}
        {argument.relevance}
      </Text>

      {/* Commentaire s'il y en a un */}
      {argument.claimComment && (
        <Text style={styles.argumentComment}>
          Note: {argument.claimComment}
        </Text>
      )}

      {/* Références associées */}
      {argumentRefs.length > 0 && (
        <View style={styles.referencesSection}>
          <Text style={styles.referencesTitle}>
            Références associées ({argumentRefs.length})
          </Text>
          {argumentRefs.map((ref) => (
            <Link
              key={ref.id}
              src={`#ref-${ref.id}`}
              style={styles.referenceLink}
            >
              • {ref.title}
            </Link>
          ))}
        </View>
      )}

      {/* Lien de retour vers le sommaire */}
      <Link src="#sommaire-arguments" style={styles.backLink}>
        ↑ Retour au sommaire
      </Link>
    </View>
  );
};

// ========== COMPOSANT PRINCIPAL ==========
export const PdfDocument = ({
  thesis = "",
  context = "",
  forma = "Descriptif",
  tree = { children: [] },
  definitions = [],
  references = [],
  getArgumentCode = (id) => id,
  getArgumentColor = () => "gray",
}) => {
  // Fonction récursive pour collecter tous les arguments
  const collectAllArguments = (node, all = []) => {
    if (node.id && node.id !== "root") all.push(node);
    if (node.children) {
      node.children.forEach((child) => collectAllArguments(child, all));
    }
    return all;
  };

  const allArguments = collectAllArguments(tree);
  const hasArguments = allArguments.length > 0;
  const hasDefinitions = definitions && definitions.length > 0;
  const hasReferences = references && references.length > 0;

  return (
    <Document>
      {/* ========== PAGE 1 : EN-TÊTE + SOMMAIRE ========== */}
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={[styles.header, styles.keepTogether]}>
          <Text style={styles.title}>Argumentor</Text>
          <Text style={styles.subtitle}>
            Outil d'analyse argumentative •{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>

        {/* Thèse */}
        <View style={[styles.section, styles.keepTogether]}>
          <Text style={styles.sectionTitle}>Thèse principale</Text>
          <Text style={styles.thesis}>
            {thesis || "(Aucune thèse définie)"}
          </Text>

          {context && (
            <Text style={styles.context}>
              <Text style={{ fontWeight: "bold" }}>Contexte: </Text>
              {context}
            </Text>
          )}

          <Text style={styles.metadata}>
            Type: {forma} •
            {hasArguments && ` ${allArguments.length} argument(s)`}
            {hasDefinitions && ` • ${definitions.length} définition(s)`}
            {hasReferences && ` • ${references.length} référence(s)`}
          </Text>
        </View>

        {/* Sommaire des arguments */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, styles.noBreak]}
            id="sommaire-arguments"
          >
            Sommaire des arguments
          </Text>
          {!hasArguments ? (
            <Text style={{ fontStyle: "italic", color: "#95a5a6" }}>
              Aucun argument pour le moment.
            </Text>
          ) : (
            tree.children &&
            tree.children.map((arg) => (
              <ArgumentPdfNode
                key={arg.id}
                argument={arg}
                depth={0}
                getArgumentCode={getArgumentCode}
                getArgumentColor={getArgumentColor}
              />
            ))
          )}
        </View>

        {/* Note en bas de page */}
        <Text style={styles.footer}>
          Page 1/2 • Suite des détails à la page suivante
        </Text>
      </Page>

      {/* ========== PAGE 2 : DÉTAILS DES ARGUMENTS ========== */}
      {hasArguments && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Détails des arguments</Text>
          {allArguments.map((arg) => (
            <ArgumentDetails
              key={arg.id}
              argument={arg}
              getArgumentCode={getArgumentCode}
              getArgumentColor={getArgumentColor}
              references={references}
            />
          ))}

          <Text style={styles.footer}>Page 2/2</Text>
        </Page>
      )}

      {/* ========== PAGE 3 : DÉFINITIONS ET RÉFÉRENCES ========== */}
      {(hasDefinitions || hasReferences) && (
        <Page size="A4" style={styles.page}>
          {/* Définitions */}
          {hasDefinitions && (
            <View style={[styles.section, styles.keepTogether]}>
              <Text style={styles.sectionTitle}>Définitions</Text>
              {definitions.map((def) => (
                <Text key={def.id} style={styles.definitionItem}>
                  <Text style={styles.definitionTerm}>{def.term}: </Text>
                  {def.definition}
                </Text>
              ))}
            </View>
          )}

          {/* Références */}
          {hasReferences && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Références</Text>
              {references.map((ref) => (
                <View
                  key={ref.id}
                  style={styles.referenceItem}
                  id={`ref-${ref.id}`}
                >
                  <Text style={styles.referenceHeader}>
                    [{ref.id}] {ref.title}
                  </Text>
                  <Text style={styles.referenceContent}>{ref.content}</Text>
                  <Link src="#sommaire-arguments" style={styles.backLink}>
                    ↑ Retour au sommaire
                  </Link>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.footer}>
            Généré avec Argumentor • https://github.com/ton-repo/argumentor
          </Text>
        </Page>
      )}
    </Document>
  );
};

export default PdfDocument;
