import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Gruppo } from "../types/type"

type GruppiState = {
    items: Gruppo[]
}

const initialState: GruppiState = {
    items: []
}

const gruppiSlice = createSlice({
    name: "gruppi",
    initialState,
    reducers: {
        setGruppi(state, action: PayloadAction<Gruppo[]>) {
            state.items = action.payload
        },
        addGruppo(state, action: PayloadAction<Gruppo>) {
            state.items.push(action.payload)
        },
        updateGruppo(state, action: PayloadAction<Gruppo>) {
            const index = state.items.findIndex((g) => g.id === action.payload.id)
            if (index >= 0) {
                state.items[index] = action.payload
            }
        },
        removeGruppo(state, action: PayloadAction<Gruppo>) {
            state.items = state.items.filter((g) => g !== action.payload)
        }
    }
})

export const { setGruppi, addGruppo, updateGruppo, removeGruppo } = gruppiSlice.actions
export const gruppiReducer = gruppiSlice.reducer
