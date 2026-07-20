import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { piattaformeReducer } from "./piattaformeSlice";
import { platformApi } from "../api/rootApi";
import { loadState, saveState } from "./storage";

const rootReducer = combineReducers({
    piattaforme: piattaformeReducer,
    [platformApi.reducerPath]: platformApi.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(platformApi.middleware)
});

store.subscribe(() => {
    saveState({ piattaforme: store.getState().piattaforme });
});
