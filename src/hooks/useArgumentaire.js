// src/hooks/useArgumentaire.js
import { useState, useRef, useCallback } from "react";
import { useArguments } from "./useArguments";
import { useDefinitions } from "./useDefinitions";
import { useReferences } from "./useReferences";

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
    console.log("💾 Sauvegarde - à implémenter");
    setIsDirty(false);
  };

  /**
   * Exporte en PDF (à implémenter plus tard)
   */
  const handleExportPdf = () => {
    console.log("📄 Export PDF - à implémenter");
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
  };
}
