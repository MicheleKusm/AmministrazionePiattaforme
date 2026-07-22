// store/riepilogoSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Piattaforma, Ruolo, Gruppo } from "../types/type"

type RiepilogoState = {
    piattaforma: Piattaforma | null
    ruoli: Ruolo[]
    gruppi: Gruppo[]
    tipoAbilitazione: "TICKET" | "VERTICALE"
}

const initialState: RiepilogoState = {
    piattaforma: null,
    ruoli: [],
    gruppi: [],
    tipoAbilitazione: "TICKET"
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
        // ---- Cruscotto ---
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
    removeGruppo
} = riepilogoSlice.actions

export const riepilogoReducer = riepilogoSlice.reducer
