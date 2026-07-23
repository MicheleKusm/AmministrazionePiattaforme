import type {
    CruscottoFieldConfig,
    CruscottoSezioneConfig,
    CruscottoStepConfig,
    CruscottoStepKey
} from "../types/type"

// Struttura CONFIG_JSON v2 (allineata a anag-commons ConfigFormDTO). Il cruscotto della
// piattaforma vive in PIATTAFORMA.CONFIG_JSON sotto la chiave "formSteps".
export type FieldDTO = {
    order?: number
    name?: string
    inputType?: string
    label?: string
    labelRiepilogo?: string
    description?: string
    apiSource?: string
    children?: FieldDTO[]
}

export type StyleDTO = {
    layout?: string
    bordered?: boolean
    dividers?: boolean
}

export type SectionDTO = {
    header?: string
    subheader?: string
    role_groups?: number[]
    style?: StyleDTO
    fields?: FieldDTO[]
}

export type FormStepDTO = {
    step: string
    descrizione?: string
    role_groups?: number[]
    sections?: SectionDTO[]
}

const STEP_KEYS: CruscottoStepKey[] = ["STEP_RUOLO", "STEP_DATI", "STEP_METADATI"]

function isCruscottoKey(step: string): step is CruscottoStepKey {
    return (STEP_KEYS as string[]).includes(step)
}

// ---- fields ----
function fieldDtoToConfig(f: FieldDTO): CruscottoFieldConfig {
    return {
        order: f.order ?? 1,
        name: f.name ?? "",
        inputType: f.inputType ?? "",
        label: f.label,
        labelRiepilogo: f.labelRiepilogo,
        description: f.description,
        apiSource: f.apiSource,
        children: f.children ? f.children.map(fieldDtoToConfig) : undefined
    }
}

function configToFieldDto(f: CruscottoFieldConfig): FieldDTO {
    const dto: FieldDTO = { order: f.order, name: f.name, inputType: f.inputType }
    if (f.label) dto.label = f.label
    if (f.labelRiepilogo) dto.labelRiepilogo = f.labelRiepilogo
    if (f.description) dto.description = f.description
    if (f.apiSource) dto.apiSource = f.apiSource
    if (f.children && f.children.length > 0) dto.children = f.children.map(configToFieldDto)
    return dto
}

// ---- sections ----
function sectionDtoToConfig(s: SectionDTO): CruscottoSezioneConfig {
    return {
        header: s.header ?? "",
        subheader: s.subheader ?? "",
        gruppiIds: s.role_groups ?? [],
        style: {
            layout: s.style?.layout ?? "list",
            bordered: s.style?.bordered ?? true,
            dividers: s.style?.dividers ?? true
        },
        fields: (s.fields ?? []).map(fieldDtoToConfig)
    }
}

function configToSectionDto(s: CruscottoSezioneConfig): SectionDTO {
    return {
        header: s.header,
        subheader: s.subheader,
        role_groups: s.gruppiIds,
        style: { layout: s.style.layout, bordered: s.style.bordered, dividers: s.style.dividers },
        fields: s.fields.map(configToFieldDto)
    }
}

// ---- steps ----
// backend (formSteps) -> stato UI del builder
export function formStepsToCruscotto(formSteps: FormStepDTO[]): CruscottoStepConfig[] {
    return (formSteps ?? [])
        .filter((s) => isCruscottoKey(s.step))
        .map((s) => ({
            chiave: s.step as CruscottoStepKey,
            abilitato: true,
            descrizione: s.descrizione ?? "",
            gruppiIds: s.role_groups ?? [],
            sezioni: (s.sections ?? []).map(sectionDtoToConfig)
        }))
}

// stato UI del builder -> backend (solo gli step abilitati entrano in formSteps)
export function cruscottoToFormSteps(cruscotto: CruscottoStepConfig[]): FormStepDTO[] {
    return cruscotto
        .filter((c) => c.abilitato)
        .map((c) => {
            const step: FormStepDTO = {
                step: c.chiave,
                descrizione: c.descrizione,
                role_groups: c.gruppiIds
            }
            // STEP_RUOLO non ha sezioni; per gli altri step si serializzano le sezioni configurate
            if (c.chiave !== "STEP_RUOLO" && c.sezioni.length > 0) {
                step.sections = c.sezioni.map(configToSectionDto)
            }
            return step
        })
}
