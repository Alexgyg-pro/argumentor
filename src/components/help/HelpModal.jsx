// src/components/help/HelpModal.jsx
import { useState } from "react";
import { Modal } from "../modals/Modal";
import styles from "./HelpModal.module.css";
import { welcomeContent } from "./contents/welcome";
import { theoryContent } from "./contents/theory";
import { instructionsContent } from "./contents/instructions";

export function HelpModal({ isOpen, onClose, onLoadExample }) {
  const [activeTab, setActiveTab] = useState("welcome");

  if (!isOpen) return null;

  // Liste des exemples disponibles
  const examples = [
    {
      id: "lune1969",
      title: "Lune 1969",
      description:
        "Un argumentaire complet sur le débat concernant l'alunissage de 1969",
      file: "lune1969.json",
      arguments: 12,
      references: 8,
      lastUpdated: "2024-12-15",
    },
    {
      id: "mars2031",
      title: "Mars 2031l",
      description: "Il faut tenter de coloniser Mars",
      file: "mars2031.json",
      arguments: 8,
      references: 5,
      lastUpdated: "2024-12-10",
    },
    {
      id: "loyers",
      title: "Augmentation des loyers",
      description: "Il faut tenter de coloniser Mars",
      file: "loyers.json",
      arguments: 8,
      references: 5,
      lastUpdated: "2025-12-02",
    },
    // {
    //   id: "teletravail",
    //   title: "🏠 Télétravail",
    //   description: "Pour ou contre le télétravail généralisé ?",
    //   file: "teletravail.json",
    //   arguments: 8,
    //   references: 5,
    //   lastUpdated: "2024-12-10",
    //   comingSoon: true,
    // },
    // {
    //   id: "react-vs-vue",
    //   title: "⚛️ React vs Vue",
    //   description:
    //     "Comparaison des frameworks front-end pour un projet d'entreprise",
    //   file: "react_vs_vue.json",
    //   arguments: 6,
    //   references: 4,
    //   lastUpdated: "2024-12-05",
    //   comingSoon: true,
    // },
  ];

  // Contenu des onglets
  const tabContents = {
    welcome: welcomeContent,
    theory: theoryContent,
    manual: instructionsContent,
    examples: `
      <h2>🎯 Exemples d'argumentaires</h2>
      <p>Sélectionnez un exemple ci-dessous pour le charger dans l'application :</p>
    `,
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // const handleLoadExample = (example) => {
  //   console.log("Chargement de l'exemple:", example.title);
  //   if (onLoadExample) {
  //     onLoadExample(example.file);
  //   }
  //   onClose();
  // };

  // const handleLoadExample = async (filename) => {
  //   console.log(`🔄 Dans Menu.jsx, appel de handleLoadExample avec:`, filename);

  //   try {
  //     const success = await onLoadExample(filename); // onLoadExample vient du hook
  //     console.log(`✅ Résultat de handleLoadExample:`, success);

  //     if (success) {
  //       // Optionnel: afficher un message de succès
  //       // alert(`Exemple "${filename}" chargé avec succès!`);
  //     }
  //   } catch (error) {
  //     console.error(`❌ Erreur dans Menu.jsx:`, error);
  //   }

  //   // Ferme la modale
  //   setShowHelp(false);
  // };

  const handleExampleClick = (example) => {
    console.log("Chargement de l'exemple:", example.title);

    // Vérifie que la fonction existe
    if (onLoadExample && typeof onLoadExample === "function") {
      // Appelle avec juste le nom du fichier
      onLoadExample(example.file);
    } else {
      console.error("❌ Erreur: onLoadExample n'est pas une fonction");
    }

    // Ferme la modale
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📚 Argumentor - Aide"
      size="large"
      className={styles.helpModal}
    >
      <div className={styles.modalContainer}>
        {/* Onglets */}
        <div className={styles.tabs}>
          {[
            { id: "welcome", label: "Bienvenue" },
            { id: "theory", label: "Théorie" },
            { id: "manual", label: "Mode d'emploi" },
            { id: "examples", label: "Exemples" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Zone de contenu principale */}
        <div className={styles.contentArea}>
          <div className={styles.scrollableContent}>
            {activeTab === "examples" ? (
              <div className={styles.examplesContainer}>
                <div
                  className={styles.markdownContent}
                  dangerouslySetInnerHTML={createMarkup(tabContents.examples)}
                />

                <div className={styles.examplesList}>
                  {examples.map((example) => (
                    <div
                      key={example.id}
                      className={styles.exampleCard}
                      onClick={
                        !example.comingSoon
                          ? () => handleLoadExample(example)
                          : undefined
                      }
                      style={{
                        opacity: example.comingSoon ? 0.6 : 1,
                        cursor: example.comingSoon ? "default" : "pointer",
                      }}
                    >
                      <div className={styles.exampleTitle}>
                        {example.title}
                        {example.comingSoon && (
                          <span
                            style={{
                              fontSize: "11px",
                              background: "#f0f0f0",
                              color: "#666",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              marginLeft: "8px",
                            }}
                          >
                            Bientôt
                          </span>
                        )}
                      </div>
                      <div className={styles.exampleDescription}>
                        {example.description}
                      </div>
                      <div className={styles.exampleDetails}>
                        <span>📊 {example.arguments} arguments</span>
                        <span>📚 {example.references} références</span>
                        <span>🕒 {example.lastUpdated}</span>
                      </div>
                      {!example.comingSoon && (
                        <button
                          className={styles.loadButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExampleClick(example);
                          }}
                        >
                          Charger cet exemple
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    fontSize: "14px",
                    color: "#7f8c8d",
                  }}
                >
                  <p>
                    <strong>💡 Comment utiliser les exemples :</strong>
                  </p>
                  <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                    <li>Cliquez sur un exemple pour le charger</li>
                    <li>Explorez la structure de l'argumentaire</li>
                    <li>Modifiez-le pour créer votre propre version</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div
                className={styles.markdownContent}
                dangerouslySetInnerHTML={createMarkup(tabContents[activeTab])}
              />
            )}
          </div>
        </div>

        {/* Pied de page */}
        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={onClose}>
            {activeTab === "examples"
              ? "Retour à l'application"
              : "Commencer à argumenter !"}
          </button>
          <div className={styles.version}>Version 0.1 - 11 janvier 2026</div>
        </div>
      </div>
    </Modal>
  );
}
