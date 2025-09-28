import "./App.module.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { ChoiceScreen } from "./components/ChoiceScreen";
import { EditingScreen } from "./components/EditingScreen";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer";
import { NewArgumentaireModal } from "./components/common/NewArgumentaireModal";
import { useState, useEffect } from "react";
import "./index.css";
import styles from "./App.module.css";

function App() {
  const argumentaire = useArgumentaire();
  const [showNewModal, setShowNewModal] = useState(false);
  const [pendingThesis, setPendingThesis] = useState(null);

  // 🔥 PROPRE : Appliquer la thèse quand le mode passe à "editing"
  useEffect(() => {
    if (pendingThesis && argumentaire.currentMode === "editing") {
      argumentaire.handleThesisChange(pendingThesis);
      setPendingThesis(null);
    }
  }, [
    pendingThesis,
    argumentaire.currentMode,
    argumentaire.handleThesisChange,
  ]);

  const handleNewWithModal = () => {
    setShowNewModal(true);
  };

  const handleModalSave = (newThesis) => {
    // Stocker la thèse en attente
    setPendingThesis(newThesis);

    // Passer en mode édition
    argumentaire.setCurrentMode("editing");
    argumentaire.setIsNewThesis(true);
    setShowNewModal(false);
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
              handleNew={handleNewWithModal}
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
