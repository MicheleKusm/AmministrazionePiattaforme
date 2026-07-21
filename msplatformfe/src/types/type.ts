export type RuoliStepProps = {
    piattaformaId?: number
    onAdd: () => void
    onEdit: (ruolo: Ruolo) => void
    onDelete: (ruolo: Ruolo) => void
}

export type RuoliTableProps = {
    ruoli: Ruolo[]
    onEdit: (ruolo: Ruolo) => void
    onDelete: (ruolo: Ruolo) => void
}

export type Column<T> = {
    header: string
    render: (item: T) => React.ReactNode
}

export type TableProps<T> = {
    data: T[]
    columns: Column<T>[]
    keyExtractor: (item: T) => React.Key
    emptyMessage?: React.ReactNode
    className?: string // container esterno
    tableClassName?: string // per elemento <table>
}

export type TipoAbilitazione = "TICKET" | "VERTICALE";

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
    abilitazione: TipoAbilitazione;
};

export type Ruolo = {
    id: number;
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
    utilizzoModelloAutorizzativo: false,
    abilitazione: "TICKET"
}

export const WIZARD_STEPS = ["Elenco", "Piattaforma", "Ruoli", "Abilitazione", "Gruppi", "Cruscotto", "Riepilogo"] as const;
