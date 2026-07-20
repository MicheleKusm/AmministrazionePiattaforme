export type Piattaforma = {
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

export type Ruolo = {
    id?: number;
    idPiattaforma?: number;
    nome: string;
    descrizione: string;
    richiedibileDaProcesso: boolean;
};

export type Gruppo = {
    id?: number;
    idPiattaforma?: number;
    nome: string;
    descrizione: string;
    ruoliIds: number[];
};

export type PageResponse<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export const emptyPiattaforma: Piattaforma = {
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

export const WIZARD_STEPS = ["Elenco", "Piattaforma", "Ruoli", "Gruppi", "Abilitazione", "Cruscotto", "Riepilogo"] as const;
