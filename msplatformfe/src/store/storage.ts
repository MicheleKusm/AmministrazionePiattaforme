import { Constants } from "../utils/Constants";
import type { RootState } from "./store";

export function loadState(): Partial<RootState> | undefined {
    try {
        const raw = localStorage.getItem(Constants.storage.PIATTAFORME);
        if (!raw) {
            return undefined;
        }
        return JSON.parse(raw) as Partial<RootState>;
    } catch {
        return undefined;
    }
}

export function saveState(state: Partial<RootState>): void {
    try {
        localStorage.setItem(Constants.storage.PIATTAFORME, JSON.stringify(state));
    } catch {
        return;
    }
}
