import "./App.module.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { ChoiceScreen } from "./components/ChoiceScreen";
import { EditingScreen } from "./components/EditingScreen";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer"; // ← À créer
import "./index.css";
import styles from "./App.module.css"; // ← IMPORT AJOUTÉ

function App() {
  const argumentaire = useArgumentaire(); // ← DOIT ÊTRE DANS LE COMPOSANT

  console.log("🔍 App - currentMode:", argumentaire.currentMode);
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
            <EditingScreen {...argumentaire} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// function App() {
//   const argumentaire = useArgumentaire();

//   console.log("📱 Ecran actuel:", argumentaire.currentMode);

//   return (
//     <div className="app min-h-screen bg-beige flex flex-col">
//       <Header /> {/* ← HEADER GLOBAL */}
//       <Menu />
//       <main className="flex-1">
//         {/* Input file toujours dans App.jsx */}
//         <input
//           type="file"
//           ref={argumentaire.fileInputRef}
//           accept=".json"
//           style={{ display: "none" }}
//           onChange={argumentaire.handleFileChange}
//         />

//         {argumentaire.currentMode === "choice" ? (
//           <ChoiceScreen
//             handleNew={argumentaire.handleNew}
//             handleImportInit={argumentaire.handleImportInit}
//           />
//         ) : (
//           <EditingScreen {...argumentaire} />
//         )}
//       </main>
//       <Footer /> {/* ← FOOTER GLOBAL */}
//     </div>
//   );
// }

export default App;
