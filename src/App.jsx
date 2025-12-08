// src/App.jsx
import "./App.module.css";
import styles from "./App.module.css";
import "./index.css";
import { useArgumentaire } from "./hooks/useArgumentaire";
import { useDefinitions } from "./hooks/useDefinitions";
import { useReferences } from "./hooks/useReferences";
import { Header } from "./components/layout/Header";
import { Menu } from "./components/layout/Menu";
import { Footer } from "./components/layout/Footer";
import { StartScreen } from "./components/screens/StartScreen";
import { DisplayScreen } from "./components/screens/DisplayScreen";
import { ArgumentaireModal } from "./components/modals/ArgumentaireModal";
import "./App.css";

function App() {
  const argumentaire = useArgumentaire();
  const definitions = useDefinitions();
  const references = useReferences();

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
        onHelp={argumentaire.handleHelp}
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
                onNewArgumentaire={argumentaire.handleNewArgumentaire}
                thesis={argumentaire.thesis}
                context={argumentaire.context}
                forma={argumentaire.forma}
                onEdit={() => argumentaire.setEditingArgumentaire(true)}
                onExport={argumentaire.handleExport}
                onImportInit={argumentaire.handleImportInit}
                fileInputRef={argumentaire.fileInputRef}
                onFileSelect={argumentaire.handleFileSelect}
                // Arguments (gérés par useArgumentaire qui utilise useArguments en interne)
                argumentTree={argumentaire.argumentTree}
                onAddArgument={argumentaire.handleAddArgument}
                onEditArgument={argumentaire.handleEditArgument}
                onDeleteArgument={argumentaire.handleDeleteArgument}
                onMoveArgument={argumentaire.handleMoveArgument}
                // Définitions
                definitions={definitions.definitions}
                onAddDefinition={definitions.addDefinition}
                onUpdateDefinition={definitions.updateDefinition}
                onDeleteDefinition={definitions.deleteDefinition}
                // Références
                references={references.references}
                onAddReference={references.addReference}
                onUpdateReference={references.updateReference}
                onDeleteReference={references.deleteReference}
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
