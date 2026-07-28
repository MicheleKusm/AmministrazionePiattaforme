import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { addRuolo, updateRuolo, removeRuolo } from "../store/riepilogoSlice"
import type { Ruolo } from "../types/type"

export function useRuoliWizard() {
    const dispatch = useAppDispatch()
    const ruoli = useAppSelector((state) => state.riepilogo.ruoli)

    const handleAddRuolo = useCallback(
        (ruolo: Ruolo) => {
            dispatch(addRuolo(ruolo))
        },
        [dispatch]
    )

    const handleUpdateRuolo = useCallback(
        (ruolo: Ruolo) => {
            dispatch(updateRuolo(ruolo))
        },
        [dispatch]
    )

    const confirmDeleteRuolo = useCallback(
        (ruoloToDelete: Ruolo) => {
            dispatch(removeRuolo(ruoloToDelete))
        },
        [dispatch]
    )

    return {
        ruoli,
        handleAddRuolo,
        handleUpdateRuolo,
        confirmDeleteRuolo
    }
}
