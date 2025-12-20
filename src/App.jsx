// src/App.jsx
import "./App.module.css";
import styles from "./App.module.css";
import "./index.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer";
import { StartScreen } from "./components/screens/StartScreen";
import { DisplayScreen } from "./components/screens/DisplayScreen";
import { ArgumentaireModal } from "./components/modals/ArgumentaireModal";

function App() {
  const argumentaire = useArgumentaire();

  return (
    <div className={styles.app}>
      <Header />
      <Menu
        isDirty={argumentaire.isDirty}
        onNew={() => argumentaire.handleNewArgumentaire({}, true)}
        onImport={argumentaire.handleImportInit}
        onEdit={() => argumentaire.setEditingArgumentaire(true)}
        onSave={argumentaire.handleSave}
        onDownload={argumentaire.handleDownload}
        onExport={argumentaire.handleExportPdf}
      />
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          {argumentaire.currentMode === "start" ||
          argumentaire.currentMode === "start-with-form" ? (
            <StartScreen
              onNewArgumentaire={argumentaire.handleNewArgumentaire}
              onImportInit={argumentaire.handleImportInit}
              fileInputRef={argumentaire.fileInputRef}
              onFileSelect={argumentaire.handleFileSelect}
              onEdit={() => argumentaire.setEditingArgumentaire(true)}
              autoShowForm={argumentaire.currentMode === "start-with-form"}
            />
          ) : argumentaire.currentMode === "display" ? (
            <>
              <DisplayScreen
                // Argumentaire
                argumentaire={argumentaire}
                thesis={argumentaire.thesis}
                context={argumentaire.context}
                forma={argumentaire.forma}
                onEdit={() => argumentaire.setEditingArgumentaire(true)}
                onImportInit={argumentaire.handleImportInit}
                fileInputRef={argumentaire.fileInputRef}
                onFileSelect={argumentaire.handleFileSelect}
                // Arguments
                argumentTree={argumentaire.argumentTree}
                onAddArgument={argumentaire.onAddArgument}
                onEditArgument={argumentaire.onEditArgument}
                onMoveArgument={argumentaire.onMoveArgument}
                onGetPossibleParents={argumentaire.onGetPossibleParents}
                onDeleteArgument={argumentaire.onDeleteArgument}
                argumentsCount={argumentaire.argumentsCount}
                neutralArgumentsCount={argumentaire.neutralArgumentsCount}
                // Définitions
                definitions={argumentaire.definitions}
                onAddDefinition={argumentaire.onAddDefinition}
                onUpdateDefinition={argumentaire.onUpdateDefinition}
                onDeleteDefinition={argumentaire.onDeleteDefinition}
                definitionsCount={argumentaire.definitionsCount}
                // Références
                references={argumentaire.references}
                onAddReference={argumentaire.onAddReference}
                onUpdateReference={argumentaire.onUpdateReference}
                onDeleteReference={argumentaire.onDeleteReference}
                referencesCount={argumentaire.referencesCount}
              />
              <ArgumentaireModal
                isOpen={argumentaire.editingArgumentaire}
                onClose={argumentaire.handleCancelEdit}
                onSave={argumentaire.handleUpdateArgumentaire}
                initialData={{
                  thesis: argumentaire.thesis,
                  context: argumentaire.context,
                  forma: argumentaire.forma,
                }}
              />
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
