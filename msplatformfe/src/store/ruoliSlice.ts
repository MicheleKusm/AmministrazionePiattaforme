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
            state.items = state.items.filter((r) => r !== action.payload)
        }
    }
})

export const { setRuoli, addRuolo, updateRuolo, removeRuolo } = ruoliSlice.actions
export const ruoliReducer = ruoliSlice.reducer
