// src/hooks/useArgumentaire.js
import React from "react";
import { useState, useRef, useCallback } from "react";
import { useArguments } from "./useArguments";
import { useDefinitions } from "./useDefinitions";
import { useReferences } from "./useReferences";
// import { generatePdf } from "../utils/pdfUtils";

export function useArgumentaire() {
  // ============ ÉTAT DE L'ARGUMENTAIRE ============
  const [thesis, setThesis] = useState("");
  const [context, setContext] = useState("");
  const [forma, setForma] = useState("Descriptif");
  const [currentMode, setCurrentMode] = useState("start");
  const [isDirty, setIsDirty] = useState(false);
  const [editingArgumentaire, setEditingArgumentaire] = useState(false);
  const fileInputRef = useRef(null);

  // ============ HOOKS SPÉCIALISÉS ============
  const argumentsHook = useArguments();
  const definitionsHook = useDefinitions();
  const referencesHook = useReferences();

  // ============ FONCTIONS DE GESTION DE L'ARGUMENTAIRE ============

  /**
   * Crée un nouvel argumentaire (réinitialise tout)
   */
  const handleNewArgumentaire = (formData = {}, forceShowForm = false) => {
    // 1. Métadonnées
    setThesis(formData.thesis || "");
    setContext(formData.context || "");
    setForma(formData.forma || "Descriptif");

    // 2. Réinitialiser TOUTES les données
    argumentsHook.setArguments({
      id: "root",
      claim: formData.thesis || "",
      children: [],
    });
    definitionsHook.resetDefinitions();
    referencesHook.resetReferences();

    // 3. État
    const hasData = formData.thesis || formData.context || formData.forma;
    setIsDirty(!!hasData);

    // 4. Mode d'affichage
    setCurrentMode(forceShowForm ? "start-with-form" : "display");
  };

  /**
   * Met à jour les métadonnées de l'argumentaire
   */
  const handleUpdateArgumentaire = (formData) => {
    setThesis(formData.thesis);
    setContext(formData.context);
    setForma(formData.forma);
    setIsDirty(true);
    setEditingArgumentaire(false);
  };

  /**
   * Annule l'édition de l'argumentaire
   */
  const handleCancelEdit = () => {
    setEditingArgumentaire(false);
  };

  // ============ IMPORT/EXPORT ============

  /**
   * Déclenche la sélection de fichier pour l'import
   */
  const handleImportInit = () => {
    fileInputRef.current?.click();
  };

  /**
   * Gère l'import d'un fichier JSON
   */
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        // 1. Métadonnées
        setThesis(jsonData.thesis || "");
        setContext(jsonData.context || "");
        setForma(jsonData.forma || "Descriptif");

        // 2. Arbre d'arguments
        argumentsHook.importArguments(
          jsonData.tree || {
            id: "root",
            claim: jsonData.thesis || "",
            children: [],
          }
        );

        // 3. Définitions
        definitionsHook.importDefinitions(jsonData.definitions || []);

        // 4. Références
        referencesHook.importReferences(jsonData.globalReferences || []);

        // 5. État
        setCurrentMode("display");
        setIsDirty(false);
      } catch (error) {
        alert(`Erreur d'import : ${error.message}`);
      }
      // Reset pour pouvoir re-sélectionner le même fichier
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  /**
   * Exporte l'argumentaire complet en JSON
   */
  const handleDownload = () => {
    const data = {
      // Métadonnées
      thesis,
      context,
      forma,

      // Données structurées (même pattern pour tout)
      definitions: definitionsHook.definitions,
      globalReferences: referencesHook.references,
      tree: argumentsHook.argumentTree,

      // Métadonnées techniques
      version: "1.0",
      downloadedAt: new Date().toISOString(),
    };

    // Création et téléchargement du fichier
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Nom du fichier basé sur la thèse
    const fileName = thesis
      ? `argumentaire_${thesis.substring(0, 20)}.json`.replace(
          /[^a-z0-9]/gi,
          "_"
        )
      : "argumentaire.json";
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Sauvegarde l'argumentaire (à implémenter plus tard)
   */
  const handleSave = () => {
    setIsDirty(false);
  };

  /**
   * Compte tous les arguments dans l'arbre
   */
  const countArguments = useCallback(() => {
    return argumentsHook.countAllArguments();
  }, [argumentsHook]);

  const countNeutralArguments = useCallback(() => {
    return argumentsHook.countNeutralArguments();
  }, [argumentsHook]);

  /**
   * Exporte en PDF (à implémenter plus tard)
   */
  const handleExportPdf = useCallback(async () => {
    try {
      console.log("📄 Début génération PDF");

      // Validation des données
      if (!argumentsHook.argumentTree) {
        alert(
          "Aucun argumentaire à exporter. Veuillez créer ou importer un argumentaire d'abord."
        );
        return;
      }

      // Import dynamique pour éviter le bundle initial
      const { pdf } = await import("@react-pdf/renderer");
      const { PdfDocument } = await import("../components/pdf/PdfDocument");

      const pdfData = {
        thesis,
        context,
        forma,
        tree: argumentsHook.argumentTree || { children: [] },
        definitions: definitionsHook.definitions || [],
        references: referencesHook.references || [],
        getArgumentCode: argumentsHook.getArgumentCode || ((id) => id),
      };

      console.log("📊 Données pour PDF:", pdfData);

      // Création du PDF
      const element = React.createElement(PdfDocument, pdfData);
      const instance = pdf(element);
      const blob = await instance.toBlob();

      // Téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Nom du fichier
      let fileName = "argumentaire.pdf";
      if (thesis && thesis.trim()) {
        const cleanThesis = thesis
          .substring(0, 40)
          .replace(/[^a-z0-9\s]/gi, "")
          .replace(/\s+/g, "_");
        fileName = `argumentaire_${cleanThesis}.pdf`;
      }

      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("✅ PDF généré avec succès:", fileName);
    } catch (error) {
      console.error("❌ Erreur lors de la génération du PDF:", error);
      alert(
        `Erreur lors de la génération du PDF: ${error.message}\n\nVérifie la console pour plus de détails.`
      );
    }
  }, [
    thesis,
    context,
    forma,
    argumentsHook.argumentTree,
    argumentsHook.getArgumentCode,
    definitionsHook.definitions,
    referencesHook.references,
  ]);

  // ============ RETOUR DU HOOK ============
  return {
    // === ÉTAT ===
    // Métadonnées
    thesis,
    context,
    forma,
    currentMode,
    setCurrentMode,
    isDirty,
    editingArgumentaire,
    setEditingArgumentaire,

    // Données
    argumentTree: argumentsHook.argumentTree,
    definitions: definitionsHook.definitions,
    references: referencesHook.references,

    // Compteurs
    argumentsCount: countArguments(),
    neutralArgumentsCount: countNeutralArguments(),
    definitionsCount: definitionsHook.definitions.length,
    referencesCount: referencesHook.references.length,

    // Codes et couleurs
    argumentCodes: argumentsHook.argumentCodes,
    getArgumentCode: argumentsHook.getArgumentCode,
    getArgumentColor: argumentsHook.getArgumentColor,

    // Références techniques
    fileInputRef,

    // === ACTIONS SUR L'ARGUMENTAIRE ===
    handleNewArgumentaire,
    handleUpdateArgumentaire,
    handleCancelEdit,

    // === IMPORT/EXPORT ===
    handleImportInit,
    handleFileSelect,
    handleDownload,
    handleSave,
    handleExportPdf,
    handleExportPdf,

    // === ACTIONS SUR LES ARGUMENTS ===
    onAddArgument: argumentsHook.addArgument,
    onEditArgument: argumentsHook.updateArgument,
    onDeleteArgument: argumentsHook.deleteArgument,
    onMoveArgument: argumentsHook.moveArgument,
    onGetPossibleParents: argumentsHook.getPossibleParents,

    // === ACTIONS SUR LES DÉFINITIONS ===
    onAddDefinition: definitionsHook.addDefinition,
    onUpdateDefinition: definitionsHook.updateDefinition,
    onDeleteDefinition: definitionsHook.deleteDefinition,

    // === ACTIONS SUR LES RÉFÉRENCES ===
    onAddReference: referencesHook.addReference,
    onUpdateReference: referencesHook.updateReference,
    onDeleteReference: referencesHook.deleteReference,

    // Modes line et card
    lineMode: argumentsHook.lineMode,
    allToLineMode: argumentsHook.allToLineMode,
    allToCardMode: argumentsHook.allToCardMode,
    toggleLineMode: argumentsHook.toggleLineMode,

    // === MODE COMPACT/DÉVELOPPÉ ===
    expandedNodes: argumentsHook.expandedNodes,
    toggleNodeExpansion: argumentsHook.toggleNodeExpansion,
    expandAllNodes: argumentsHook.expandAllNodes,
    collapseAllNodes: argumentsHook.collapseAllNodes,
    isNodeExpanded: argumentsHook.isNodeExpanded,

    // Débug
    _debug: {
      collapseAllExists: !!argumentsHook.collapseAll,
      expandAll: !!argumentsHook.expandAll,
    },
  };
}
