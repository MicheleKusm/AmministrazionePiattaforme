import type { ReactNode, SyntheticEvent } from "react"
import type { FormStepDTO } from "../utils/cruscottoMapper" // piattaforme

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
    formSteps?: FormStepDTO[]
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
    id: number
    idPiattaforma?: number
    nome: string
    descrizione: string
    ruoliIds: number[]
    daEliminare?: boolean
}

export type GruppiStepProps = {
    gruppi: Gruppo[]
    ruoli: Ruolo[]
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

export type GruppiTableProps = {
    gruppi: Gruppo[]
    ruoli: Ruolo[]
    onEdit: (gruppo: Gruppo) => void
    onDelete: (gruppo: Gruppo) => void
}

// dto persistenza
export type PersistenceObject = {
    piattaforma: Piattaforma
    ruoli: Ruolo[]
    gruppiAppartenenza: Gruppo[]
    abilitazioni: Abilitazione[]
}

// wizard
export const WIZARD_STEPS = ["Elenco", "Piattaforma", "Ruoli", "Abilitazione", "Gruppi", "Cruscotto", "Riepilogo"] as const

export type TipoAbilitazione = "TICKET" | "VERTICALE"

export type StatoAbilitazione = "Attiva" | "Disattiva"

export type TipologicaCampoDinamico = {
    tipoDati: string
    type: string
    regex: string | null
    idTipoDati?: number
    apiSource: string | null
}

export type CampoTicket = {
    id: number
    idTipoDati?: number
    label: string
    descrizione: string
    order: number
    key: string
    inputType: string
    required: boolean
    regex: string
    cssClass: string | null
    apiSource: string | null
}

export type TipoIcona = "solid" | "outline"

export type ComunicazioneOnboarding = {
    id: number
    icona: string
    typeIcona?: TipoIcona
    testo: string
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
    order: 1,
    label: "",
    descrizione: "",
    key: "",
    inputType: "",
    required: true,
    regex: "",
    cssClass: null,
    apiSource: ""
}

export const emptyComunicazione: ComunicazioneOnboarding = {
    id: 0,
    icona: "",
    typeIcona: "solid",
    testo: ""
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

// cruscotto
export type CruscottoStepKey = "STEP_RUOLO" | "STEP_DATI" | "STEP_METADATI"

export type CruscottoFieldConfig = {
    order: number
    name: string
    inputType: string
    label?: string
    labelRiepilogo?: string
    description?: string
    apiSource?: string | null
    children?: CruscottoFieldConfig[]
}

export type CruscottoSezioneStyle = {
    layout: string
    bordered: boolean
    dividers: boolean
}

export type CruscottoSezioneConfig = {
    header: string
    subheader: string
    gruppiIds: number[]
    style: CruscottoSezioneStyle
    fields: CruscottoFieldConfig[]
}

export type CruscottoStepConfig = {
    chiave: CruscottoStepKey
    abilitato: boolean
    descrizione: string
    gruppiIds: number[]
    sezioni: CruscottoSezioneConfig[]
}

export function makeDefaultCruscotto(): CruscottoStepConfig[] {
    return [
        { chiave: "STEP_RUOLO", abilitato: true, descrizione: "", gruppiIds: [], sezioni: [] },
        { chiave: "STEP_DATI", abilitato: true, descrizione: "", gruppiIds: [], sezioni: [] },
        { chiave: "STEP_METADATI", abilitato: true, descrizione: "", gruppiIds: [], sezioni: [] }
    ]
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
    cruscotto: CruscottoStepConfig[]
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
    align?: "left" | "center" | "right"
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

export type ModalProps = {
    title: string
    onClose: () => void
    children: ReactNode
    footer?: ReactNode
    headerClassName?: string
    modalClassName?: string
}

export type ResultModalProps = {
    title?: string
    message?: string
    isOpen: boolean
    onClose: () => void
    success: boolean
    errors?: string[]
    genericError?: boolean
}
