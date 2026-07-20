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
        UTILIZZO_MODELLO_AUTORIZZATIVO: "Utilizzo modello autorizzativo"
    } as const

    static readonly labelAbilitazione = {
        TICKET: "Ticket",
        VERTICALE: "Verticale"
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
