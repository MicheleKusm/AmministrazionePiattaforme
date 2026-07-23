// store/riepilogoSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Abilitazione, CruscottoStepConfig, Gruppo, Piattaforma, RiepilogoState, Ruolo } from "../types/type"

const initialState: RiepilogoState = {
    piattaforma: null,
    ruoli: [],
    gruppi: [],
    abilitazioni: [],
    cruscotto: []
}

const riepilogoSlice = createSlice({
    name: "riepilogo",
    initialState,
    reducers: {
        // ---- Reset ----
        resetRiepilogo: () => initialState,
        // ---- Piattaforma ----
        setPiattaforma: (state, action: PayloadAction<Piattaforma>) => {
            state.piattaforma = action.payload
        },
        updatePiattaforma: (state, action: PayloadAction<Piattaforma>) => {
            state.piattaforma = action.payload
        },
        // ---- Ruoli ----
        setRuoli: (state, action: PayloadAction<Ruolo[]>) => {
            state.ruoli = action.payload
        },
        addRuolo: (state, action: PayloadAction<Ruolo>) => {
            state.ruoli.push(action.payload)
        },
        updateRuolo: (state, action: PayloadAction<Ruolo>) => {
            const idx = state.ruoli.findIndex((r) => r.id === action.payload.id)
            if (idx >= 0) state.ruoli[idx] = action.payload
        },
        removeRuolo: (state, action: PayloadAction<Ruolo>) => {
            const ruolo = action.payload
            if (ruolo.id > 0) {
                const existing = state.ruoli.find((r) => r.id === ruolo.id)
                if (existing) existing.daEliminare = true
            } else {
                state.ruoli = state.ruoli.filter((r) => r.id !== ruolo.id)
            }
        },
        // ---- Gruppi ----
        setGruppi: (state, action: PayloadAction<Gruppo[]>) => {
            state.gruppi = action.payload
        },
        addGruppo: (state, action: PayloadAction<Gruppo>) => {
            state.gruppi.push(action.payload)
        },
        updateGruppo: (state, action: PayloadAction<Gruppo>) => {
            const idx = state.gruppi.findIndex((g) => g.id === action.payload.id)
            if (idx >= 0) state.gruppi[idx] = action.payload
        },
        removeGruppo: (state, action: PayloadAction<Gruppo>) => {
            const gruppo = action.payload
            if (gruppo.id && gruppo.id > 0) {
                const existing = state.gruppi.find((g) => g.id === gruppo.id)
                if (existing) existing.daEliminare = true
            } else {
                state.gruppi = state.gruppi.filter((g) => g.id !== gruppo.id)
            }
        },
        // ---- Abilitazione ----
        setAbilitazioni: (state, action: PayloadAction<Abilitazione[]>) => {
            state.abilitazioni = action.payload
        },
        addAbilitazione: (state, action: PayloadAction<Abilitazione>) => {
            state.abilitazioni.push(action.payload)
        },
        updateAbilitazione: (state, action: PayloadAction<Abilitazione>) => {
            const idx = state.abilitazioni.findIndex((a) => a.id === action.payload.id)
            if (idx >= 0) state.abilitazioni[idx] = action.payload
        },
        removeAbilitazione: (state, action: PayloadAction<Abilitazione>) => {
            const abilitazione = action.payload
            if (abilitazione.id > 0) {
                const existing = state.abilitazioni.find((a) => a.id === abilitazione.id)
                if (existing) existing.daEliminare = true
            } else {
                state.abilitazioni = state.abilitazioni.filter((a) => a.id !== abilitazione.id)
            }
        },
        // ---- Cruscotto ----
        setCruscotto: (state, action: PayloadAction<CruscottoStepConfig[]>) => {
            state.cruscotto = action.payload
        },
        updateCruscottoStep: (state, action: PayloadAction<CruscottoStepConfig>) => {
            const idx = state.cruscotto.findIndex((c) => c.chiave === action.payload.chiave)
            if (idx >= 0) state.cruscotto[idx] = action.payload
            else state.cruscotto.push(action.payload)
        }
    }
})

export const {
    resetRiepilogo,
    setPiattaforma,
    updatePiattaforma,
    setRuoli,
    addRuolo,
    updateRuolo,
    removeRuolo,
    setGruppi,
    addGruppo,
    updateGruppo,
    removeGruppo,
    setAbilitazioni,
    addAbilitazione,
    updateAbilitazione,
    removeAbilitazione,
    setCruscotto,
    updateCruscottoStep
} = riepilogoSlice.actions

export const riepilogoReducer = riepilogoSlice.reducer
