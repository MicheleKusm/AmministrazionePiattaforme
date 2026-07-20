import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { piattaformeReducer } from "./piattaformeSlice";
import { loadState, saveState } from "./storage";

const rootReducer = combineReducers({
    piattaforme: piattaformeReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState()
});

store.subscribe(() => {
    saveState({ piattaforme: store.getState().piattaforme });
});
