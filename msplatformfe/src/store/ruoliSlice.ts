import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Ruolo } from "../types/type"

type RuoliState = {
    items: Ruolo[]
}

const initialState: RuoliState = {
    items: []
}

const ruoliSlice = createSlice({
    name: "ruoli",
    initialState,
    reducers: {
        setRuoli(state, action: PayloadAction<Ruolo[]>) {
            state.items = action.payload
        },
        addRuolo(state, action: PayloadAction<Ruolo>) {
            state.items.push(action.payload)
        },
        updateRuolo(state, action: PayloadAction<Ruolo>) {
            const index = state.items.findIndex((r) => r.id === action.payload.id)
            if (index >= 0) {
                state.items[index] = action.payload
            }
        },
        removeRuolo(state, action: PayloadAction<Ruolo>) {
            const ruolo = action.payload;
            if (ruolo.id > 0) {
                // se id > 0 (esistente a db) marca per eliminazione a db, altrimenti elimina direttamente dallo store
                const existing = state.items.find(r => r.id === ruolo.id);
                if (existing) {
                    existing.daEliminare = true;
                }
            } else {
                state.items = state.items.filter(r => r.id !== ruolo.id);
            }
        }
    }
})

export const { setRuoli, addRuolo, updateRuolo, removeRuolo } = ruoliSlice.actions
export const ruoliReducer = ruoliSlice.reducer
