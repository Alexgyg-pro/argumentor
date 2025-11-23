// src/App.jsx
import "./App.module.css";
import styles from "./App.module.css";
import "./index.css";
import { useState } from "react";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer";
import { StartScreen } from "./components/screens/StartScreen";
import { DisplayScreen } from "./components/screens/DisplayScreen";

import {
  PlusIcon,
  DownloadIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  PdfIcon,
  NewIcon,
} from "./components/common/Icons";
import "./App.css";

function App() {
  const argumentaire = useArgumentaire();

  return (
    <div className={styles.app}>
      <Header />
      <Menu />
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          {argumentaire.currentMode === "start" ? (
            <StartScreen
              onNewArgumentaire={argumentaire.handleNewArgumentaire}
              onImportInit={argumentaire.handleImportInit}
            />
          ) : (
            <DisplayScreen
              onNewArgumentaire={argumentaire.handleNewArgumentaire}
              thesis={argumentaire.thesis}
              context={argumentaire.context}
              forma={argumentaire.forma}
              onUpdateArgumentaire={argumentaire.handleUpdateArgumentaire}
              argumentTree={argumentaire.argumentTree}
              onAddArgument={argumentaire.handleAddArgument}
              onEditArgument={argumentaire.handleEditArgument}
              onDeleteArgument={argumentaire.handleDeleteArgument}
              onExport={argumentaire.handleExport}
              onImportInit={argumentaire.handleImportInit}
              fileInputRef={argumentaire.fileInputRef}
              onFileSelect={argumentaire.handleFileSelect}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
