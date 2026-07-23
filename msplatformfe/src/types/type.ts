import type { ReactNode, SyntheticEvent } from "react"

// piattaforme
export type Piattaforma = {
    id?: number
    nome: string
    descrizione: string
    url: string
    canale: string
    objClass: string
    readOnly: boolean
    codiceIct: string
    oamMetadataName: string
    oamMetadataValue: string
    richiedibileDaCruscotto: boolean
    richiedibileInCorso: boolean
    ripetibile: boolean
    utilizzoModelloAutorizzativo: boolean
    abilitazione: TipoAbilitazione
}

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

export type PlatformListPageProps = {
    onCreate: () => void
    onEdit: (piattaforma: Piattaforma) => void
}

export type PlatformWizardPageProps = {
    initialPiattaforma: Piattaforma
    onDone: () => void
    onCancel: () => void
}

export type PiattaformaStepProps = {
    piattaforma: Piattaforma
    onChange: (piattaforma: Piattaforma) => void
    errors?: Record<string, string>
}

// ruoli
export type Ruolo = {
    id: number
    nome: string
    descrizione: string
    richiedibileDaProcesso: boolean
    daEliminare?: boolean
}

export type RuoliStepProps = {
    piattaformaId?: number
    ruoli: Ruolo[]
    onAdd: () => void
    onEdit: (ruolo: Ruolo) => void
    onDelete: (ruolo: Ruolo) => void
}

export type RoleModalProps = {
    role: Ruolo
    onSave: (role: Ruolo) => void
    onClose: () => void
}

export type RuoliTableProps = {
    ruoli: Ruolo[]
    onEdit: (ruolo: Ruolo) => void
    onDelete: (ruolo: Ruolo) => void
    piattaformaId?: number
}

// gruppi
export type Gruppo = {
    id?: number
    idPiattaforma?: number
    nome: string
    descrizione: string
    ruoliIds: number[]
    daEliminare?: boolean
}
export type GruppiStepProps = {
    gruppi: Gruppo[]
    onAdd: () => void
    onEdit: (gruppo: Gruppo) => void
    onDelete: (gruppo: Gruppo) => void
}

export type GroupModalProps = {
    group: Gruppo
    ruoli: Ruolo[]
    onSave: (group: Gruppo) => void
    onClose: () => void
}

// wizard
export const WIZARD_STEPS = ["Elenco", "Piattaforma", "Ruoli", "Abilitazione", "Gruppi", "Cruscotto", "Riepilogo"] as const

//  Abilitazione associata
export type TipoAbilitazione = "TICKET" | "VERTICALE"

export type StatoAbilitazione = "Attiva" | "Disattiva"

export type CanaleComunicazione = "Email" | "SMS" | "In-app" | "Push" | "Webhook" | "WhatsApp"

export type TipologicaCampoDinamico = {
    tipoDati: string
    type: string
    regex: string | null
    idTipoDati: number
}

export type CampoTicket = {
    id: number
    label: string
    descrizione: string
    campo: string
    tipoValore: string
    obbligatoria: boolean
    regex: string
}

export type ComunicazioneOnboarding = {
    id: number
    icona: string
    descrizione: string
    obbligatoria: boolean
}

export type Abilitazione = {
    id: number
    nome: string
    tipo: TipoAbilitazione
    riferimento: string
    stato: StatoAbilitazione
    processKey: string
    codiceScim: string
    processoVerticale: string
    campi: CampoTicket[]
    comunicazioni: ComunicazioneOnboarding[]
    daEliminare?: boolean
}

export type AbilitazioniTableProps = {
    abilitazioni: Abilitazione[]
    onDetail: (abilitazione: Abilitazione) => void
    onEdit: (abilitazione: Abilitazione) => void
    onDelete: (abilitazione: Abilitazione) => void
}

export type CampiTicketTableProps = {
    campi: CampoTicket[]
    onEdit: (campo: CampoTicket) => void
    onDelete: (campo: CampoTicket) => void
}

export type ComunicazioniTableProps = {
    comunicazioni: ComunicazioneOnboarding[]
    onEdit: (comunicazione: ComunicazioneOnboarding) => void
    onDelete: (comunicazione: ComunicazioneOnboarding) => void
}

export const emptyCampoTicket: CampoTicket = {
    id: 0,
    label: "",
    descrizione: "",
    campo: "",
    tipoValore: "",
    obbligatoria: true,
    regex: ""
}

export const emptyComunicazione: ComunicazioneOnboarding = {
    id: 0,
    icona: "",
    descrizione: "",
    obbligatoria: true
}

export function makeEmptyAbilitazione(): Abilitazione {
    return {
        id: 0,
        nome: "",
        tipo: "TICKET",
        riferimento: "",
        stato: "Attiva",
        processKey: "",
        codiceScim: "",
        processoVerticale: "",
        campi: [],
        comunicazioni: []
    }
}

// riepilogo
export type RiepilogoStepProps = {
    piattaforma: Piattaforma
    ruoli: Ruolo[]
    gruppi: Gruppo[]
    tipoAbilitazione: "TICKET" | "VERTICALE"
}

// slices
export type RiepilogoState = {
    piattaforma: Piattaforma | null
    ruoli: Ruolo[]
    gruppi: Gruppo[]
    abilitazioni: Abilitazione[]
}

// componenti
export type DeleteConfirmationModalProps = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
}

export type FormProps = {
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void
    onCancel?: () => void
    children: ReactNode
    submitLabel?: string
    cancelLabel?: string
    isSubmitting?: boolean
    className?: string
}

export type FormFieldProps = {
    children: ReactNode
    error?: string
    className?: string
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

export type PageResponse<T> = {
    content: T[]
    number: number
    size: number
    totalElements: number
    totalPages: number
}
