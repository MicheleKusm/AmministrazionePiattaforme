import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { PlatformListPage } from "./pages/PlatformListPage";
import { PlatformWizardPage } from "./pages/PlatformWizardPage";
import { emptyPiattaforma, type Piattaforma } from "./types";

export function App() {
    const [activeMenu, setActiveMenu] = useState<"dashboard" | "config">("config");
    const [wizardMode, setWizardMode] = useState(false);
    const [piattaforma, setPiattaforma] = useState<Piattaforma>(emptyPiattaforma);

    function openCreate() {
        setPiattaforma(emptyPiattaforma);
        setWizardMode(true);
    }

    function openEdit(p: Piattaforma) {
        setPiattaforma({ ...emptyPiattaforma, ...p });
        setWizardMode(true);
    }

    function closeWizard() {
        setWizardMode(false);
        setPiattaforma(emptyPiattaforma);
    }

    return (
        <div className="layout">
            <Sidebar activeMenu={activeMenu} onChangeMenu={setActiveMenu} />

            <main className="content">
                <Topbar />

                {!wizardMode ? (
                    <PlatformListPage onCreate={openCreate} onEdit={openEdit} />
                ) : (
                    <PlatformWizardPage initialPiattaforma={piattaforma} onCancel={closeWizard} onDone={closeWizard} />
                )}
            </main>
        </div>
    );
}
