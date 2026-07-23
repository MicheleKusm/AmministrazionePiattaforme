import type { CruscottoStepConfig, CruscottoStepKey } from "../types/type"

// Struttura CONFIG_JSON v2 (allineata a anag-commons ConfigFormDTO.FormStepDTO / Section).
// Il cruscotto della piattaforma vive in PIATTAFORMA.CONFIG_JSON sotto la chiave "formSteps".
export type SectionDTO = {
    header?: string
    subheader?: string
    role_groups?: number[]
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

export function formStepsToCruscotto(formSteps: FormStepDTO[]): CruscottoStepConfig[] {
    return (formSteps ?? [])
        .filter((s) => isCruscottoKey(s.step))
        .map((s) => ({
            chiave: s.step as CruscottoStepKey,
            abilitato: true,
            descrizione: s.descrizione ?? "",
            gruppiIds: s.role_groups ?? [],
            sezioni: s.sections
        }))
}

export function cruscottoToFormSteps(cruscotto: CruscottoStepConfig[]): FormStepDTO[] {
    return cruscotto
        .filter((c) => c.abilitato)
        .map((c) => {
            const step: FormStepDTO = {
                step: c.chiave,
                descrizione: c.descrizione,
                role_groups: c.gruppiIds
            }
            // STEP_RUOLO non ha sezioni; per STEP_DATI / STEP_METADATI si preservano quelle esistenti
            if (c.chiave !== "STEP_RUOLO" && c.sezioni && c.sezioni.length > 0) {
                step.sections = c.sezioni as SectionDTO[]
            }
            return step
        })
}
