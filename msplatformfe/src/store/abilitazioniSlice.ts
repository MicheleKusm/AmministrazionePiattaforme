import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Abilitazione } from "../types/type"

type AbilitazioniState = {
    items: Abilitazione[]
}

const initialState: AbilitazioniState = {
    items: []
}

const abilitazioniSlice = createSlice({
    name: "abilitazioni",
    initialState,
    reducers: {
        setAbilitazioni(state, action: PayloadAction<Abilitazione[]>) {
            state.items = action.payload
        },
        addAbilitazione(state, action: PayloadAction<Abilitazione>) {
            state.items.push(action.payload)
        },
        updateAbilitazione(state, action: PayloadAction<Abilitazione>) {
            const index = state.items.findIndex((g) => g.id === action.payload.id)
            if (index >= 0) {
                state.items[index] = action.payload
            }
        },
        removeAbilitazione(state, action: PayloadAction<Abilitazione>) {
            const abilitazione = action.payload
            if (abilitazione.id && abilitazione.id > 0) {
                const existing = state.items.find((g) => g.id === abilitazione.id)
                if (existing) {
                    existing.daEliminare = true
                }
            } else {
                state.items = state.items.filter((g) => g.id !== abilitazione.id)
            }
        }
    }
})

export const { setAbilitazioni, addAbilitazione, updateAbilitazione, removeAbilitazione } = abilitazioniSlice.actions
export const abilitazioniReducer = abilitazioniSlice.reducer
