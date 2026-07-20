import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockPiattaforme } from "./mockPiattaforme";
import type { Piattaforma } from "../types/type";

type PiattaformeState = {
    items: Piattaforma[];
};

const initialState: PiattaformeState = {
    items: mockPiattaforme
};

const piattaformeSlice = createSlice({
    name: "piattaforme",
    initialState,
    reducers: {
        setPiattaforme(state, action: PayloadAction<Piattaforma[]>) {
            state.items = action.payload;
        },
        addPiattaforma(state, action: PayloadAction<Piattaforma>) {
            state.items.push(action.payload);
        },
        updatePiattaforma(state, action: PayloadAction<Piattaforma>) {
            const index = state.items.findIndex((p) => p.id === action.payload.id);
            if (index >= 0) {
                state.items[index] = action.payload;
            }
        },
        removePiattaforma(state, action: PayloadAction<number>) {
            state.items = state.items.filter((p) => p.id !== action.payload);
        }
    }
});

export const { setPiattaforme, addPiattaforma, updatePiattaforma, removePiattaforma } = piattaformeSlice.actions;
export const piattaformeReducer = piattaformeSlice.reducer;
