import ReactDOM from "react-dom/client";
import { useEffect, useMemo, useState } from "react";
import "./styles.css";

type Piattaforma = {
    id?: number;
    nome: string;
    descrizione: string;
    url: string;
    canale: string;
    objClass: string;
    readOnly: boolean;
    codiceIct: string;
    oamMetadataName: string;
    oamMetadataValue: string;
    richiedibileDaCruscotto: boolean;
    richiedibileInCorso: boolean;
    ripetibile: boolean;
    utilizzoModelloAutorizzativo: boolean;
};

type Ruolo = {
    id?: number;
    idPiattaforma?: number;
    nome: string;
    descrizione: string;
    richiedibileDaProcesso: boolean;
};

type Gruppo = {
    id?: number;
    idPiattaforma?: number;
    nome: string;
    descrizione: string;
    ruoliIds: number[];
};

type PageResponse<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

const emptyPiattaforma: Piattaforma = {
    nome: "",
    descrizione: "",
    url: "",
    canale: "",
    objClass: "",
    readOnly: false,
    codiceIct: "",
    oamMetadataName: "",
    oamMetadataValue: "",
    richiedibileDaCruscotto: false,
    richiedibileInCorso: false,
    ripetibile: false,
    utilizzoModelloAutorizzativo: false
};

const steps = [
    "Elenco",
    "Piattaforma",
    "Ruoli",
    "Gruppi",
    "Abilitazione",
    "Cruscotto",
    "Riepilogo"
];

function App() {
    if (window.location.pathname === "/fake-login") {
        return (
            <main className="center">
                <h1>Fake Login</h1>
                <button
                    className="btn-primary"
                    onClick={() => {
                        sessionStorage.setItem("fake-auth", "ok");
                        window.location.href = "/";
                    }}
                    type="button"
                >
                    Entra come ADMIN RGS
                </button>
            </main>
        );
    }

    if (sessionStorage.getItem("fake-auth") !== "ok") {
        return (
            <main className="center">
                <h1>Accesso richiesto</h1>
                <p>Per sviluppo locale usa la route di bypass:</p>
                <a href="/fake-login">http://localhost:3000/fake-login</a>
            </main>
        );
    }

    return <AdministrationConsole />;
}

function AdministrationConsole() {
    const [activeMenu, setActiveMenu] = useState<"dashboard" | "config">("config");
    const [wizardMode, setWizardMode] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [loading, setLoading] = useState(false);
    const [platformPage, setPlatformPage] = useState<PageResponse<Piattaforma>>({
        content: [],
        number: 0,
        size: 5,
        totalElements: 0,
        totalPages: 0
    });

    const [piattaforma, setPiattaforma] = useState<Piattaforma>(emptyPiattaforma);
    const [ruoli, setRuoli] = useState<Ruolo[]>([]);
    const [gruppi, setGruppi] = useState<Gruppo[]>([]);
    const [tipoAbilitazione, setTipoAbilitazione] = useState<"TICKET" | "VERTICALE">("TICKET");
    const [processoVerticale, setProcessoVerticale] = useState("");

    const [roleDraft, setRoleDraft] = useState<Ruolo | null>(null);
    const [groupDraft, setGroupDraft] = useState<Gruppo | null>(null);

    useEffect(() => {
        if (!wizardMode) {
            loadPiattaforme();
        }
    }, [wizardMode, page, search]);

    const currentPlatformId = piattaforma.id;
    useEffect(() => {
        if (currentPlatformId && wizardMode) {
            void loadRuoli(currentPlatformId);
            void loadGruppi(currentPlatformId);
        }
    }, [currentPlatformId, wizardMode]);

    async function loadPiattaforme() {
        setLoading(true);
        const response = await fetch(`/api/piattaforme?search=${encodeURIComponent(search)}&page=${page}&size=${size}`);
        const data = (await response.json()) as PageResponse<Piattaforma>;
        setPlatformPage(data);
        setLoading(false);
    }

    async function loadRuoli(idPiattaforma: number) {
        const response = await fetch(`/api/ruoli?piattaformaId=${idPiattaforma}`);
        if (response.ok) {
            const data = (await response.json()) as Ruolo[];
            setRuoli(data.map((r) => ({ ...r, richiedibileDaProcesso: false })));
        }
    }

    async function loadGruppi(idPiattaforma: number) {
        const response = await fetch(`/api/gruppi?piattaformaId=${idPiattaforma}`);
        if (response.ok) {
            const data = (await response.json()) as Gruppo[];
            setGruppi(data);
        }
    }

    function openCreate() {
        setPiattaforma(emptyPiattaforma);
        setRuoli([]);
        setGruppi([]);
        setWizardStep(2);
        setWizardMode(true);
    }

    function openEdit(p: Piattaforma) {
        setPiattaforma({ ...emptyPiattaforma, ...p });
        setWizardStep(2);
        setWizardMode(true);
    }

    function prevStep() {
        setWizardStep((prev) => Math.max(1, prev - 1));
    }

    function nextStep() {
        setWizardStep((prev) => Math.min(7, prev + 1));
    }

    async function saveFinalConfiguration() {
        const payload = piattaforma;
        const method = piattaforma.id ? "PUT" : "POST";
        const url = piattaforma.id ? `/api/piattaforme/${piattaforma.id}` : "/api/piattaforme";
        const platformResponse = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const savedPlatform = (await platformResponse.json()) as Piattaforma;

        for (const ruolo of ruoli) {
            const ruoloPayload = {
                idPiattaforma: savedPlatform.id,
                nome: ruolo.nome,
                descrizione: ruolo.descrizione
            };
            if (ruolo.id) {
                await fetch(`/api/ruoli/${ruolo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ruoloPayload)
                });
            } else {
                await fetch("/api/ruoli", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ruoloPayload)
                });
            }
        }

        for (const gruppo of gruppi) {
            const gruppoPayload = {
                idPiattaforma: savedPlatform.id,
                nome: gruppo.nome,
                descrizione: gruppo.descrizione,
                ruoliIds: gruppo.ruoliIds
            };
            if (gruppo.id) {
                await fetch(`/api/gruppi/${gruppo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(gruppoPayload)
                });
            } else {
                await fetch("/api/gruppi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(gruppoPayload)
                });
            }
        }

        setWizardMode(false);
        setWizardStep(1);
        await loadPiattaforme();
    }

    const tableRows = useMemo(() => platformPage.content ?? [], [platformPage]);

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2>Administration Console</h2>
                <button
                    className={activeMenu === "dashboard" ? "menu active" : "menu"}
                    onClick={() => setActiveMenu("dashboard")}
                    type="button"
                >
                    Dashboard
                </button>
                <button
                    className={activeMenu === "config" ? "menu active" : "menu"}
                    onClick={() => setActiveMenu("config")}
                    type="button"
                >
                    Configurazioni Piattaforma
                </button>
            </aside>

            <main className="content">
                <header className="topbar">
                    <span>ADMIN RGS</span>
                </header>

                {!wizardMode ? (
                    <>
                        <section className="toolbar">
                            <input
                                onChange={(e) => {
                                    setPage(0);
                                    setSearch(e.target.value);
                                }}
                                placeholder="Cerca piattaforma..."
                                value={search}
                            />
                            <button className="btn-primary" onClick={openCreate} type="button">
                                Aggiungi piattaforma
                            </button>
                        </section>

                        <table className="grid">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Canale</th>
                                    <th>Objclass</th>
                                    <th>In sola lettura</th>
                                    <th>Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={5}>Caricamento...</td>
                                    </tr>
                                )}
                                {!loading &&
                                    tableRows.map((row) => (
                                        <tr key={row.id}>
                                            <td>{row.nome}</td>
                                            <td>{row.canale}</td>
                                            <td>{row.objClass}</td>
                                            <td>{row.readOnly ? "Sì" : "No"}</td>
                                            <td>
                                                <button className="btn-secondary" onClick={() => openEdit(row)} type="button">
                                                    Modifica
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <footer className="pager">
                            <button disabled={page <= 0} onClick={() => setPage((p) => p - 1)} type="button">
                                Indietro
                            </button>
                            <span>
                                Pagina {platformPage.number + 1} / {Math.max(platformPage.totalPages, 1)}
                            </span>
                            <button
                                disabled={platformPage.number + 1 >= platformPage.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                type="button"
                            >
                                Avanti
                            </button>
                        </footer>
                    </>
                ) : (
                    <>
                        <ol className="stepper">
                            {steps.map((label, index) => (
                                <li className={wizardStep === index + 1 ? "step active" : wizardStep > index + 1 ? "step done" : "step"} key={label}>
                                    {index + 1}. {label}
                                </li>
                            ))}
                        </ol>

                        {wizardStep === 2 && (
                            <section className="card">
                                <h3>Dati base piattaforma</h3>
                                <div className="form-grid">
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, nome: e.target.value })} placeholder="Nome piattaforma" value={piattaforma.nome} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, canale: e.target.value })} placeholder="Canale" value={piattaforma.canale} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, descrizione: e.target.value })} placeholder="Descrizione" value={piattaforma.descrizione} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, objClass: e.target.value })} placeholder="Objclass" value={piattaforma.objClass} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, url: e.target.value })} placeholder="Url" value={piattaforma.url} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, codiceIct: e.target.value })} placeholder="Codice ICT" value={piattaforma.codiceIct} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, oamMetadataName: e.target.value })} placeholder="OAM Metadata Name" value={piattaforma.oamMetadataName} />
                                    <input onChange={(e) => setPiattaforma({ ...piattaforma, oamMetadataValue: e.target.value })} placeholder="OAM Metadata Value" value={piattaforma.oamMetadataValue} />
                                </div>
                                <div className="toggles">
                                    {[
                                        ["Richiedibile da cruscotto", "richiedibileDaCruscotto"],
                                        ["In sola lettura", "readOnly"],
                                        ["Richiedibile in corso", "richiedibileInCorso"],
                                        ["Ripetibile", "ripetibile"],
                                        ["Utilizzo modello autorizzativo", "utilizzoModelloAutorizzativo"]
                                    ].map(([label, key]) => (
                                        <label key={key}>
                                            <input
                                                checked={Boolean(piattaforma[key as keyof Piattaforma])}
                                                onChange={(e) => setPiattaforma({ ...piattaforma, [key]: e.target.checked } as Piattaforma)}
                                                type="checkbox"
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </section>
                        )}

                        {wizardStep === 3 && (
                            <section className="card">
                                <h3>Ruoli piattaforma</h3>
                                <button className="btn-primary" onClick={() => setRoleDraft({ nome: "", descrizione: "", richiedibileDaProcesso: false })} type="button">
                                    Aggiungi ruolo
                                </button>
                                <ul>
                                    {ruoli.map((r, idx) => (
                                        <li key={r.id ?? idx}>
                                            <strong>{r.nome}</strong> - {r.descrizione}
                                            <button className="btn-secondary" onClick={() => setRoleDraft(r)} type="button">
                                                Modifica
                                            </button>
                                            <button className="btn-danger" onClick={() => setRuoli(ruoli.filter((x) => x !== r))} type="button">
                                                Elimina
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {wizardStep === 4 && (
                            <section className="card">
                                <h3>Gruppi operativi</h3>
                                <button className="btn-primary" onClick={() => setGroupDraft({ nome: "", descrizione: "", ruoliIds: [] })} type="button">
                                    Aggiungi gruppo
                                </button>
                                <ul>
                                    {gruppi.map((g, idx) => (
                                        <li key={g.id ?? idx}>
                                            <strong>{g.nome}</strong> - {g.descrizione}
                                            <button className="btn-secondary" onClick={() => setGroupDraft(g)} type="button">
                                                Modifica
                                            </button>
                                            <button className="btn-danger" onClick={() => setGruppi(gruppi.filter((x) => x !== g))} type="button">
                                                Elimina
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {wizardStep === 5 && (
                            <section className="card">
                                <h3>Tipo di abilitazione</h3>
                                <div className="choices">
                                    <button
                                        className={tipoAbilitazione === "VERTICALE" ? "btn-primary" : "btn-secondary"}
                                        onClick={() => setTipoAbilitazione("VERTICALE")}
                                        type="button"
                                    >
                                        Abilitazione Verticale
                                    </button>
                                    <button className={tipoAbilitazione === "TICKET" ? "btn-primary" : "btn-secondary"} onClick={() => setTipoAbilitazione("TICKET")} type="button">
                                        Abilitazione Ticket
                                    </button>
                                </div>
                                {tipoAbilitazione === "VERTICALE" ? (
                                    <input onChange={(e) => setProcessoVerticale(e.target.value)} placeholder="Processo verticale" value={processoVerticale} />
                                ) : (
                                    <p>Configura campi ticket e comunicazioni onboarding nel passo successivo.</p>
                                )}
                            </section>
                        )}

                        {wizardStep === 6 && (
                            <section className="card">
                                <h3>Cruscotto dinamico</h3>
                                <p>Configurazione base dei blocchi STEP_RUOLO, STEP_DATI e STEP_METADATI.</p>
                                <p>In questa versione standalone sono disponibili gli elementi essenziali.</p>
                            </section>
                        )}

                        {wizardStep === 7 && (
                            <section className="card">
                                <h3>Riepilogo finale</h3>
                                <p>
                                    <strong>Piattaforma:</strong> {piattaforma.nome || "-"}
                                </p>
                                <p>
                                    <strong>Ruoli:</strong> {ruoli.length}
                                </p>
                                <p>
                                    <strong>Gruppi:</strong> {gruppi.length}
                                </p>
                                <p>
                                    <strong>Tipo abilitazione:</strong> {tipoAbilitazione}
                                </p>
                            </section>
                        )}

                        <div className="actions">
                            <button className="btn-secondary" onClick={() => (wizardStep === 1 ? setWizardMode(false) : prevStep())} type="button">
                                Indietro
                            </button>
                            {wizardStep < 7 ? (
                                <button className="btn-primary" onClick={nextStep} type="button">
                                    Avanti
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={() => void saveFinalConfiguration()} type="button">
                                    Salva configurazione
                                </button>
                            )}
                        </div>
                    </>
                )}
            </main>

            {roleDraft && (
                <RoleModal
                    onClose={() => setRoleDraft(null)}
                    onSave={(role) => {
                        setRuoli((prev) => {
                            const found = prev.find((x) => x === roleDraft || (x.id && x.id === roleDraft.id));
                            if (found) {
                                return prev.map((x) => (x === found ? role : x));
                            }
                            return [...prev, role];
                        });
                        setRoleDraft(null);
                    }}
                    role={roleDraft}
                />
            )}

            {groupDraft && (
                <GroupModal
                    group={groupDraft}
                    onClose={() => setGroupDraft(null)}
                    onSave={(group) => {
                        setGruppi((prev) => {
                            const found = prev.find((x) => x === groupDraft || (x.id && x.id === groupDraft.id));
                            if (found) {
                                return prev.map((x) => (x === found ? group : x));
                            }
                            return [...prev, group];
                        });
                        setGroupDraft(null);
                    }}
                    ruoli={ruoli}
                />
            )}
        </div>
    );
}

function RoleModal({ role, onSave, onClose }: { role: Ruolo; onSave: (role: Ruolo) => void; onClose: () => void }) {
    const [draft, setDraft] = useState<Ruolo>(role);
    function submit(e: { preventDefault: () => void }) {
        e.preventDefault();
        onSave(draft);
    }
    return (
        <div className="modal-backdrop">
            <form className="modal" onSubmit={submit}>
                <h4>Aggiungi / Modifica ruolo</h4>
                <input onChange={(e) => setDraft({ ...draft, nome: e.target.value })} placeholder="Nome" required value={draft.nome} />
                <textarea onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })} placeholder="Descrizione" required value={draft.descrizione} />
                <label>
                    <input
                        checked={draft.richiedibileDaProcesso}
                        onChange={(e) => setDraft({ ...draft, richiedibileDaProcesso: e.target.checked })}
                        type="checkbox"
                    />
                    Richiedibile da processo
                </label>
                <div className="actions">
                    <button className="btn-secondary" onClick={onClose} type="button">
                        Annulla
                    </button>
                    <button className="btn-primary" type="submit">
                        Salva
                    </button>
                </div>
            </form>
        </div>
    );
}

function GroupModal({
    group,
    ruoli,
    onSave,
    onClose
}: {
    group: Gruppo;
    ruoli: Ruolo[];
    onSave: (group: Gruppo) => void;
    onClose: () => void;
}) {
    const [draft, setDraft] = useState<Gruppo>(group);
    function toggleRuolo(idRuolo?: number) {
        if (!idRuolo) {
            return;
        }
        const next = draft.ruoliIds.includes(idRuolo) ? draft.ruoliIds.filter((id) => id !== idRuolo) : [...draft.ruoliIds, idRuolo];
        setDraft({ ...draft, ruoliIds: next });
    }
    function submit(e: { preventDefault: () => void }) {
        e.preventDefault();
        onSave(draft);
    }
    return (
        <div className="modal-backdrop">
            <form className="modal" onSubmit={submit}>
                <h4>Aggiungi / Modifica gruppo</h4>
                <input onChange={(e) => setDraft({ ...draft, nome: e.target.value })} placeholder="Nome gruppo" required value={draft.nome} />
                <textarea onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })} placeholder="Descrizione" required value={draft.descrizione} />
                <div>
                    {ruoli.map((ruolo) => (
                        <label key={ruolo.id ?? ruolo.nome}>
                            <input checked={Boolean(ruolo.id && draft.ruoliIds.includes(ruolo.id))} onChange={() => toggleRuolo(ruolo.id)} type="checkbox" />
                            {ruolo.nome}
                        </label>
                    ))}
                </div>
                <div className="actions">
                    <button className="btn-secondary" onClick={onClose} type="button">
                        Annulla
                    </button>
                    <button className="btn-primary" type="submit">
                        Salva
                    </button>
                </div>
            </form>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
