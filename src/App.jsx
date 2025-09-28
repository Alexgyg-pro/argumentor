// App.jsx
import { useEffect } from "react";
import { useState } from "react";
import "./App.module.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { ChoiceScreen } from "./components/ChoiceScreen";
import { EditingScreen } from "./components/EditingScreen";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer"; // ← À créer
import "./index.css";
import styles from "./App.module.css";
import { NewArgumentaireModal } from "./components/common/NewArgumentaireModal";

function App() {
  const argumentaire = useArgumentaire();
  const [showNewModal, setShowNewModal] = useState(false);

  // 🔥 NOUVEAU : Réagir aux changements de thèse
  useEffect(() => {
    console.log("🔥 useEffect - thesis updated:", argumentaire.thesis);
    console.log("🔥 useEffect - currentMode:", argumentaire.currentMode);
  }, [argumentaire.thesis, argumentaire.currentMode]);

  const handleNewWithModal = () => {
    console.log("🆕 Bouton Nouveau cliqué");
    setShowNewModal(true);
  };

  const handleModalSave = (newThesis) => {
    console.log("💾 handleModalSave appelé avec:", newThesis);

    // 1. Mettre à jour la thèse
    argumentaire.handleThesisChange(newThesis);

    // 2. Passer en mode édition APRÈS la mise à jour
    // On va utiliser le timeout pour l'instant, mais idéalement avec useEffect
    setTimeout(() => {
      console.log("⏰ Timeout - Mise à jour du mode");
      argumentaire.setCurrentMode("editing");
      argumentaire.setIsNewThesis(true);
      setShowNewModal(false);
    }, 100);
  };

  const handleModalCancel = () => {
    setShowNewModal(false);
  };

  return (
    <div className={styles.app}>
      <Header />
      <Menu />

      <main className={styles.main}>
        <div className={styles.contentContainer}>
          {argumentaire.currentMode === "choice" ? (
            <ChoiceScreen
              handleNew={handleNewWithModal} // ← Nouvelle fonction
              handleImport={argumentaire.handleImport}
              fileInputRef={argumentaire.fileInputRef}
            />
          ) : (
            <EditingScreen {...argumentaire} />
          )}
        </div>
      </main>

      <Footer />

      <NewArgumentaireModal
        isOpen={showNewModal}
        onSave={handleModalSave}
        onCancel={handleModalCancel}
      />
    </div>
  );
}

export default App;
