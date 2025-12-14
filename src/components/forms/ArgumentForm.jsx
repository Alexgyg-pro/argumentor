// src/components/forms/ArgumentForm.jsx
import { useState, useEffect } from "react";
import { Form, FormField, FormActions } from "./Forms";
import { ReferenceSelector } from "./ReferenceSelector";
import styles from "./Forms.module.css";

export function ArgumentForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  references = []  // ← Nouvelle prop pour toutes les références
}) {
  const [formData, setFormData] = useState({
    claim: "",
    claimComment: "",
    causa: "neutralis",
    forma: "descriptif",
    natura: "validity",
    validity: 0.5,
    relevance: 0.5,
    value: 0.5,
    weight: 0.5,
    references: [],  // ← IDs des références associées
    ...initialData,
  });

  // Mettre à jour formData quand initialData change
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        references: initialData.references || [],
      }));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.claim.trim()) {
      alert("L'énoncé de l'argument est obligatoire");
      return;
    }
    
    onSubmit(formData);
    
    // Réinitialiser seulement si pas en mode édition
    if (!initialData.id) {
      setFormData({
        claim: "",
        claimComment: "",
        causa: "neutralis",
        forma: "descriptif",
        natura: "validity",
        validity: 0.5,
        relevance: 0.5,
        value: 0.5,
        weight: 0.5,
        references: [],
      });
    }
  };

  const handleReferenceChange = (selectedRefIds) => {
    setFormData(prev => ({
      ...prev,
      references: selectedRefIds,
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Énoncé de l'argument" required>
        <textarea
          value={formData.claim}
          onChange={(e) => setFormData(prev => ({ ...prev, claim: e.target.value }))}
          placeholder="Énoncez clairement l'argument..."
          rows={3}
          required
          autoFocus
          className={styles.textarea}
        />
      </FormField>

      <FormField label="Commentaire (optionnel)">
        <textarea
          value={formData.claimComment}
          onChange={(e) => setFormData(prev => ({ ...prev, claimComment: e.target.value }))}
          placeholder="Explications, précisions, contexte..."
          rows={2}
          className={styles.textarea}
        />
      </FormField>

      <div className={styles.formRow}>
        <FormField label="Cause" className={styles.halfWidth}>
          <select
            value={formData.causa}
            onChange={(e) => setFormData(prev => ({ ...prev, causa: e.target.value }))}
            className={styles.select}
          >
            <option value="pro">Pour</option>
            <option value="contra">Contre</option>
            <option value="neutralis">Neutre</option>
          </select>
        </FormField>

        <FormField label="Forme" className={styles.halfWidth}>
          <select
            value={formData.forma}
            onChange={(e) => setFormData(prev => ({ ...prev, forma: e.target.value }))}
            className={styles.select}
          >
            <option value="descriptif">Descriptif</option>
            <option value="normatif">Normatif</option>
            <option value="prescriptif">Prescriptif</option>
          </select>
        </FormField>
      </div>

      <div className={styles.formRow}>
        <FormField label="Nature" className={styles.halfWidth}>
          <select
            value={formData.natura}
            onChange={(e) => setFormData(prev => ({ ...prev, natura: e.target.value }))}
            className={styles.select}
          >
            <option value="validity">Validité</option>
            <option value="relevance">Pertinence</option>
            <option value="value">Valeur</option>
            <option value="weight">Poids</option>
          </select>
        </FormField>

        <FormField label="Validité" className={styles.halfWidth}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.validity}
            onChange={(e) => setFormData(prev => ({ ...prev, validity: parseFloat(e.target.value) }))}
            className={styles.range}
          />
          <span className={styles.rangeValue}>{formData.validity.toFixed(1)}</span>
        </FormField>
      </div>

      <div className={styles.formRow}>
        <FormField label="Pertinence" className={styles.halfWidth}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.relevance}
            onChange={(e) => setFormData(prev => ({ ...prev, relevance: parseFloat(e.target.value) }))}
            className={styles.range}
          />
          <span className={styles.rangeValue}>{formData.relevance.toFixed(1)}</span>
        </FormField>

        <FormField label="Valeur" className={styles.halfWidth}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
            className={styles.range}
          />
          <span className={styles.rangeValue}>{formData.value.toFixed(1)}</span>
        </FormField>
      </div>

      {/* NOUVEAU : Sélecteur de références */}
      <FormField label="Références associées">
        {references.length === 0 ? (
          <div className={styles.infoMessage}>
            Aucune référence disponible. 
            <br />
            <small>Créez d'abord des références dans l'onglet "Références".</small>
          </div>
        ) : (
          <ReferenceSelector
            allReferences={references}
            selectedRefIds={formData.references || []}
            onChange={handleReferenceChange}
          />
        )}
      </FormField>

      <FormActions>
        <button type="submit" className={styles.primaryButton}>
          {initialData.id ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel} className={styles.secondaryButton}>
          Annuler
        </button>
      </FormActions>
    </Form>
  );
}