import { useCallback, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { addGruppo, removeGruppo, updateGruppo } from "../store/riepilogoSlice"
import type { Gruppo } from "../types/type"

export function useGruppiWizard() {
    const dispatch = useAppDispatch()
    const allGruppi = useAppSelector((state) => state.gruppi.items)
    const editedGruppi = useAppSelector((state) => state.riepilogo.gruppi)

    // lista unita per display
    const mergedGruppi = useMemo(() => {
        const all = [...allGruppi]
        for (const t of editedGruppi) {
            const idx = all.findIndex((g) => g.id === t.id)
            if (idx >= 0) all[idx] = t
            else all.push(t)
        }
        return all
    }, [allGruppi, editedGruppi])

    // aggiunge gruppo nuovo (id temporaneo)
    const handleAddGruppo = useCallback(
        (gruppo: Gruppo) => {
            dispatch(addGruppo(gruppo))
        },
        [dispatch]
    )

    // edit (id > 0 gruppo esistente, < 0 nuovo gruppo)
    const handleUpdateGruppo = useCallback(
        (gruppo: Gruppo) => {
            const isEdited = editedGruppi.some((g) => g.id === gruppo.id)
            if (!isEdited && gruppo.id && gruppo.id > 0) {
                const original = allGruppi.find((g) => g.id === gruppo.id)
                if (original) {
                    dispatch(addGruppo({ ...original, ...gruppo }))
                } else {
                    dispatch(addGruppo(gruppo))
                }
            } else {
                dispatch(updateGruppo(gruppo))
            }
        },
        [dispatch, editedGruppi, allGruppi]
    )

    // conferma elimina (id <0 elimina da store, >0 marca daEliminare)
    const confirmDeleteGruppo = useCallback(
        (gruppoToDelete: Gruppo) => {
            const isEdited = editedGruppi.some((g) => g.id === gruppoToDelete.id)
            if (!isEdited && gruppoToDelete.id && gruppoToDelete.id > 0) {
                const original = allGruppi.find((g) => g.id === gruppoToDelete.id)
                if (original) {
                    dispatch(addGruppo({ ...original, daEliminare: true }))
                } else {
                    dispatch(addGruppo({ ...gruppoToDelete, daEliminare: true }))
                }
            } else {
                dispatch(removeGruppo(gruppoToDelete))
            }
        },
        [dispatch, editedGruppi, allGruppi]
    )

    return {
        allGruppi,
        editedGruppi,
        mergedGruppi,
        handleAddGruppo,
        handleUpdateGruppo,
        confirmDeleteGruppo
    }
}
