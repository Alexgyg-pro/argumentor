// src/components/HelpModal.jsx
import { useState } from "react";
import { Modal } from "../modals/Modal";
import styles from "./HelpModal.module.css";

export function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("welcome");
  console.log("🆘 HelpModal rendu, isOpen:", isOpen);
  if (!isOpen) {
    console.log("❌ HelpModal non rendu car isOpen = false");
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📚 Argumentor - Aide"
      size="large" // Si ta modal supporte différentes tailles
      className={styles.helpModal} // Classe CSS optionnelle
    >
      {/* Onglets */}
      <div className={styles.tabs}>
        {[
          { id: "welcome", label: "👋 Bienvenue", emoji: "👋" },
          { id: "theory", label: "📚 Théorie", emoji: "📚" },
          { id: "manual", label: "🛠️ Mode d'emploi", emoji: "🛠️" },
          { id: "examples", label: "🎯 Exemples", emoji: "🎯" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span className={styles.tabEmoji}>{tab.emoji}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className={styles.content}>
        <div
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{
            __html: formatMarkdown(helpContent[activeTab]),
          }}
        />
      </div>

      {/* Pied de page */}
      <div className={styles.footer}>
        <button className={styles.primaryButton} onClick={onClose}>
          Commencer à argumenter !
        </button>
        <div className={styles.version}>Version 0.1 - Décembre 2024</div>
      </div>
    </Modal>
    // <div
    //   style={{
    //     position: "fixed",
    //     top: "0",
    //     left: "0",
    //     width: "100vw",
    //     height: "100vh",
    //     backgroundColor: "rgba(0,0,0,0.5)",
    //     zIndex: 9999,
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <div
    //     style={{
    //       background: "white",
    //       padding: "30px",
    //       borderRadius: "10px",
    //       width: "80%",
    //       maxWidth: "800px",
    //       maxHeight: "80vh",
    //       overflow: "auto",
    //     }}
    //   >
    //     <h2>TEST - Modal d'aide</h2>
    //     <p>Si tu vois ça, la modal fonctionne !</p>
    //     <button onClick={onClose}>Fermer</button>
    //   </div>
    // </div>
    // <div className={styles.overlay}>
    //   <div className={styles.modal}>
    //     <div className={styles.header}>
    //       <h2>📚 Argumentor - Aide</h2>
    //       <button className={styles.closeButton} onClick={onClose}>
    //         ×
    //       </button>
    //     </div>

    //     <div className={styles.tabs}>
    //       {["welcome", "theory", "manual", "examples"].map((tab) => (
    //         <button
    //           key={tab}
    //           className={`${styles.tab} ${
    //             activeTab === tab ? styles.active : ""
    //           }`}
    //           onClick={() => setActiveTab(tab)}
    //         >
    //           {tab === "welcome" && "👋 Bienvenue"}
    //           {tab === "theory" && "📚 Théorie"}
    //           {tab === "manual" && "🛠️ Mode d'emploi"}
    //           {tab === "examples" && "🎯 Exemples"}
    //         </button>
    //       ))}
    //     </div>

    //     <div className={styles.content}>
    //       {activeTab === "welcome" && (
    //         <div className={styles.section}>
    //           <h3>Bienvenue dans Argumentor</h3>
    //           {/* Ton texte Bienvenue ici */}
    //         </div>
    //       )}

    //       {activeTab === "theory" && (
    //         <div className={styles.section}>
    //           <h3>La théorie derrière Argumentor</h3>
    //           {/* Ton texte Théorie ici */}
    //         </div>
    //       )}

    //       {/* ... autres onglets */}
    //     </div>

    //     <div className={styles.footer}>
    //       <button className={styles.primaryButton} onClick={onClose}>
    //         Commencer à argumenter !
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
}
