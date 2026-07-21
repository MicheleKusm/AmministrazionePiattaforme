import type { Abilitazione, TipologicaCampoDinamico } from "../types/type";

// Valori TIPO_DATI della tabella TIPOLOGICA_CAMPI_DINAMICI (mock in attesa del backend).
export const mockTipologicheCampi: TipologicaCampoDinamico[] = [
    { idTipoDati: 1, tipoDati: "EMAIL", type: "email", regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
    { idTipoDati: 2, tipoDati: "PEC", type: "email", regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
    { idTipoDati: 3, tipoDati: "MATRICOLA", type: "number", regex: null },
    { idTipoDati: 4, tipoDati: "STRINGA", type: "string", regex: null },
    { idTipoDati: 5, tipoDati: "NUMERO", type: "number", regex: "^[0-9]+$" },
    { idTipoDati: 6, tipoDati: "DATA", type: "date", regex: null },
    { idTipoDati: 7, tipoDati: "CODICE_FISCALE", type: "string", regex: "^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$" },
    { idTipoDati: 8, tipoDati: "STRUTTURA", type: "string", regex: null }
];

// Processi verticali disponibili (mock in attesa del backend).
export const mockProcessiVerticali: string[] = ["CREDITI COMMERCIALI", "GESTIONE MUTUI", "LEASING"];

// Abilitazioni già associate alla piattaforma (mock, allineato al mockup).
export const mockAbilitazioni: Abilitazione[] = [
    {
        id: 1,
        nome: "Abilitazione ticket PCC",
        tipo: "TICKET",
        riferimento: "PCC_SCIM_01",
        stato: "Attiva",
        processKey: "ALTRI",
        codiceScim: "PCC_SCIM_01",
        processoVerticale: "",
        campi: [
            { id: 1, label: "Matricola", descrizione: "", campo: "MATRICOLA", tipoValore: "number", obbligatoria: true, regex: "" },
            { id: 2, label: "Email aziendale", descrizione: "", campo: "EMAIL", tipoValore: "email", obbligatoria: true, regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
            { id: 3, label: "Struttura di appartenenza", descrizione: "", campo: "STRUTTURA", tipoValore: "string", obbligatoria: true, regex: "" },
            { id: 4, label: "Ruolo richiesto", descrizione: "", campo: "STRINGA", tipoValore: "string", obbligatoria: false, regex: "" }
        ],
        comunicazioni: [
            { id: 1, canale: "Email", descrizione: "Benvenuto nel processo di abilitazione", obbligatoria: true },
            { id: 2, canale: "Email", descrizione: "Richiesta in corso", obbligatoria: true },
            { id: 3, canale: "In-app", descrizione: "Esito richiesta", obbligatoria: true }
        ]
    },
    {
        id: 2,
        nome: "Processo Crediti commerciali",
        tipo: "VERTICALE",
        riferimento: "CREDITI COMMERCIALI",
        stato: "Attiva",
        processKey: "CREDITI COMMERCIALI",
        codiceScim: "",
        processoVerticale: "CREDITI COMMERCIALI",
        campi: [],
        comunicazioni: [
            { id: 1, canale: "Email", descrizione: "Benvenuto sulla piattaforma", obbligatoria: true },
            { id: 2, canale: "Email", descrizione: "Credenziali di accesso", obbligatoria: true },
            { id: 3, canale: "In-app", descrizione: "Guida rapida", obbligatoria: true }
        ]
    }
];
