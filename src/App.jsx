// App.jsx
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

  const handleNewWithModal = () => {
    setShowNewModal(true);
  };

  const handleModalSave = (newThesis) => {
    console.log("💾 handleModalSave appelé avec:", newThesis);

    // 1. Mettre à jour la thèse
    argumentaire.handleThesisChange(newThesis);
    console.log("📝 Thèse après handleThesisChange:", argumentaire.thesis);

    // 2. Passer en mode édition (pas choice!)
    argumentaire.setCurrentMode("editing");
    console.log("🎯 Mode après setCurrentMode:", argumentaire.currentMode);
    argumentaire.setIsNewThesis(true);

    // 3. Fermer la modale
    setShowNewModal(false);

    console.log("🎯 Current mode:", argumentaire.currentMode);
    console.log("📝 Thesis text:", argumentaire.thesis.text);
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
