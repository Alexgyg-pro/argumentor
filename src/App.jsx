// App.jsx
import "./App.module.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { ChoiceScreen } from "./components/ChoiceScreen";
import { EditingScreen } from "./components/EditingScreen";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer"; // ← À créer
import "./index.css";
import styles from "./App.module.css";

function App() {
  const argumentaire = useArgumentaire();

  console.log("🔍 App - currentMode:", argumentaire.currentMode);
  console.log("🔍 argumentaire object:", Object.keys(argumentaire));
  return (
    <div className={styles.app}>
      <Header />
      <Menu />

      <main className={styles.main}>
        <div className={styles.contentContainer}>
          {/* Choix ou édition */}
          {argumentaire.currentMode === "choice" ? (
            <ChoiceScreen {...argumentaire} />
          ) : (
            <EditingScreen
              {...argumentaire}
              isNewThesis={argumentaire.isNewThesis}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
