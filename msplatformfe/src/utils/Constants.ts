export class Constants {
    static readonly common = {
        TICKET: "TICKET",
        VERTICALE: "VERTICALE",
        CERCA_PIATTAFORMA: "Cerca piattaforma...",
        AGGIUNGI_PIATTAFORMA: "Aggiungi piattaforma",
        MODIFICA: "Modifica",
        SI: "Sì",
        NO: "No",
        NESSUNA_PIATTAFORMA: "Nessuna piattaforma trovata",
        ELENCO: "Elenco",
        PIATTAFORMA: "Piattaforma",
        RUOLI: "Ruoli",
        GRUPPI: "Gruppi",
        ABILITAZIONE: "Abilitazione",
        CRUSCOTTO: "Cruscotto",
        RIEPILOGO: "Riepilogo",
        RICHIEDIBILE_DA_CRUSCOTTO: "Richiedibile da cruscotto",
        READ_ONLY: "In sola lettura",
        RICHIEDIBILE_IN_CORSO: "Richiedibile in corso",
        RIPETIBILE: "Ripetibile",
        UTILIZZO_MODELLO_AUTORIZZATIVO: "Utilizzo modello autorizzativo",
        NUMERO_RUOLI: 5,
        PAGE_SIZE: 5
    } as const

    static readonly validation = {
        MAX_50: 50,
        MAX_100: 100,
        MAX_255: 255,
        MAX_300: 300,
        MAX_500: 500,
        MAX_4000: 4000
    } as const

    static readonly regex = {
        REGEX_LETTERS_NUMBERS: /^[a-zA-Z0-9\s]+$/,
        REGEX_NO_SPECIAL_CHARACTERS: /^[a-zA-Z0-9_\-.#]+$/
    }

    static readonly labelAbilitazione = {
        TICKET: "Ticket",
        VERTICALE: "Verticale"
    } as const

    static readonly abilitazione = {
        TITOLO_LISTA: "Abilitazioni associate",
        SOTTOTITOLO_LISTA: "Gestisci una o più abilitazioni collegate alla piattaforma.",
        SALVA_PRIMA: "Salva prima la piattaforma per gestire le abilitazioni associate.",
        AGGIUNGI: "+ Aggiungi abilitazione",
        TORNA_LISTA: "← Torna alla lista",
        NUOVA: "Nuova abilitazione",
        TITOLO_AGGIUNGI: "Aggiungi abilitazione associata",
        SOTTOTITOLO_AGGIUNGI: "Scegli il tipo di abilitazione e configura i relativi dettagli.",
        VERTICALE_TITOLO: "Abilitazione verticale",
        VERTICALE_DESC: "Associa la piattaforma a un processo verticale esistente con flussi e regole dedicate.",
        TICKET_TITOLO: "Abilitazione ticket",
        TICKET_DESC: "Configura la piattaforma per gestire richieste e ticket personalizzati.",
        SELEZIONATO: "Selezionato",
        DETTAGLI_TICKET: "Dettagli configurazione ticket",
        DETTAGLI_VERTICALE: "Dettagli configurazione",
        CODICE_SCIM: "Codice SCIM",
        CODICE_SCIM_PH: "Inserisci il codice SCIM",
        CAMPI_TICKET: "Campi richiesti nel ticket",
        AGGIUNGI_CAMPO: "+ Aggiungi chiave",
        SELEZIONA_PROCESSO: "Seleziona il processo verticale",
        SELEZIONA_PROCESSO_PH: "Seleziona un processo",
        COMUNICAZIONI: "Comunicazioni onboarding",
        AGGIUNGI_COMUNICAZIONE: "+ Aggiungi comunicazione",
        DETTAGLIO: "Dettaglio",
        MODIFICA: "Modifica",
        ELIMINA: "Elimina",
        ANNULLA: "Annulla",
        SALVA: "Salva abilitazione",
        TOTALE: "Totale",
        ABILITAZIONI_ASSOCIATE: "abilitazioni associate",
        ATTIVA: "Attiva",
        NESSUNA: "Nessuna abilitazione associata",
        NESSUN_CAMPO: "Nessuna chiave configurata.",
        NESSUNA_COMUNICAZIONE: "Nessuna comunicazione configurata.",
        CARICAMENTO: "Caricamento abilitazioni...",
        ERRORE: "Errore nel caricamento delle abilitazioni.",
        PROCESS_KEY_TICKET: "altri",
        TIPO_BLOCCATO_TICKET:
            "Questa piattaforma ha già abilitazioni ticket: puoi aggiungere solo abilitazioni ticket (non è possibile combinare ticket e verticale).",
        TIPO_BLOCCATO_VERTICALE:
            "Questa piattaforma ha già abilitazioni verticali: puoi aggiungere solo abilitazioni verticali (non è possibile combinare ticket e verticale).",
        TIPO_BLOCCATO_TITLE: "Tipo non disponibile: la piattaforma ha già abilitazioni dell'altro tipo."
    } as const

    static readonly abilitazioneTable = {
        NOME: "Nome",
        TIPO: "Tipo",
        RIFERIMENTO: "Riferimento",
        STATO: "Stato",
        AZIONI: "Azioni",
        ORDINE: "Ordine",
        LABEL: "Label",
        CAMPO: "Campo",
        OBBLIGATORIA: "Obbligatoria",
        TITOLO: "Titolo",
        CANALE: "Canale"
    } as const

    static readonly campoModal = {
        TITOLO: "Aggiungi chiave",
        LABEL: "Label",
        LABEL_PH: "Es. Matricola",
        DESCRIZIONE: "Descrizione",
        DESCRIZIONE_PH: "Breve descrizione del campo e del suo utilizzo",
        CAMPO: "Campo",
        CAMPO_PH: "Seleziona un campo",
        OBBLIGATORIO: "Obbligatorio",
        TIPO_VALORE: "Tipo valore / Validazione",
        TIPO_VALORE_PH: "Seleziona una tipologia",
        REGEX: "Regex",
        REGEX_OPZIONALE: "(opzionale)",
        REGEX_PH: "Inserisci regex di validazione (opzionale)",
        HINT: "Seleziona un campo per configurare la chiave.",
        SALVA: "Salva campo",
        ANNULLA: "Annulla"
    } as const

    static readonly comunicazioneModal = {
        TITOLO: "Aggiungi comunicazione",
        ICONA: "Scegli icona",
        ICONA_LABEL: "Icona",
        DESCRIZIONE: "Descrizione",
        DESCRIZIONE_PH: "Es. Benvenuto sulla piattaforma e prime indicazioni",
        HINT: "Descrivi brevemente il contenuto e lo scopo della comunicazione.",
        SALVA: "Salva comunicazione",
        ANNULLA: "Annulla"
    } as const

    static readonly canali = ["Email", "SMS", "In-app", "Push", "Webhook", "WhatsApp"] as const

    static readonly cruscotto = {
        TITOLO: "Struttura Cruscotto Dinamico",
        SOTTOTITOLO: "Configura gli step di inserimento e le sezioni del form visualizzati nel cruscotto dinamico (CONFIG JSON v2).",
        ATTIVO: "Attivo",
        NON_ATTIVO: "Non attivo",
        CONFIGURA_SEZIONE: "Configura la sezione",
        ABILITA_STEP: "Abilita questo Step",
        HEADER: "Header Step",
        HEADER_PH: "Es. Seleziona Ruolo",
        SUBHEADER: "Subheader Step",
        SUBHEADER_PH: "Es. Inserisci il ruolo",
        DESCRIZIONE: "Descrizione",
        DESCRIZIONE_PH: "Es. Inserisci il ruolo",
        GRUPPI_TITOLO: "Associa Gruppi di Appartenenza a questo Step",
        GRUPPI_VUOTI: "Nessun gruppo di appartenenza configurato nello step Gruppi.",
        STEP_NON_DISPONIBILE: "Configurazione non ancora disponibile per questo step (bozza: al momento e gestito solo STEP_RUOLO).",
        NON_ABILITATA_TITOLO: "Piattaforma non abilitata al cruscotto",
        NON_ABILITATA_MSG:
            "Questa piattaforma non è abilitata per il cruscotto dinamico. Per abilitarla, torna allo step Piattaforma e attiva l'opzione «Richiedibile da cruscotto»."
    } as const

    static readonly api = {
        API_PIATTAFORME: "/api/piattaforme",
        API_RUOLI_ALL: "/api/ruoli/all"
    } as const

    static readonly storage = {
        PIATTAFORME: "acrgs.piattaforme"
    } as const

    static readonly pageSize = 5
}
