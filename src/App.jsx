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
    argumentaire.handleThesisChange(newThesis);
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
