import { useEffect, useRef, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import type { Abilitazione, Piattaforma } from "../../types/type"
import { makeEmptyAbilitazione } from "../../types/type"
import { Button } from "../common/Button"
import { AbilitazioniTable } from "../tables/AbilitazioniTable"
import { AbilitazioneForm } from "./AbilitazioneForm"
import {
    useGetAbilitazioniQuery,
    useGetProcessiVerticaliQuery,
    useGetTipologicheQuery
} from "../../api/abilitazioniApi"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { addAbilitazione, removeAbilitazione, setAbilitazioni, updateAbilitazione } from "../../store/riepilogoSlice"
import { Constants } from "../../utils/Constants"

type AbilitazioneStepProps = {
    piattaforma?: Piattaforma
}

function nextTempId(items: Abilitazione[]): number {
    return Math.min(0, ...items.map((a) => a.id)) - 1
}

export function AbilitazioneStep({ piattaforma }: AbilitazioneStepProps) {
    const dispatch = useAppDispatch()
    const [draft, setDraft] = useState<Abilitazione | null>(null)
    const abilitazioniLoaded = useRef(false)

    const abilitazioni = useAppSelector((state) => state.riepilogo.abilitazioni)

    const { data: abilitazioniData } = useGetAbilitazioniQuery(piattaforma?.id ?? skipToken)
    const { data: tipologiche = [] } = useGetTipologicheQuery()
    const { data: processi = [] } = useGetProcessiVerticaliQuery()

    useEffect(() => {
        if (abilitazioniData && !abilitazioniLoaded.current && abilitazioni.length === 0) {
            dispatch(setAbilitazioni(abilitazioniData))
            abilitazioniLoaded.current = true
        }
    }, [abilitazioniData, abilitazioni.length, dispatch])

    const visibili = abilitazioni.filter((a) => !a.daEliminare)

    function salva(abilitazione: Abilitazione) {
        if (abilitazione.id === 0) {
            dispatch(addAbilitazione({ ...abilitazione, id: nextTempId(abilitazioni) }))
        } else {
            dispatch(updateAbilitazione(abilitazione))
        }
        setDraft(null)
    }

    function elimina(abilitazione: Abilitazione) {
        dispatch(removeAbilitazione(abilitazione))
    }

    if (draft) {
        return (
            <AbilitazioneForm
                piattaforma={piattaforma}
                initial={draft}
                tipologiche={tipologiche}
                processi={processi}
                onCancel={() => setDraft(null)}
                onNew={() => setDraft(makeEmptyAbilitazione())}
                onSave={salva}
            />
        )
    }

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{Constants.abilitazione.TITOLO_LISTA}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{Constants.abilitazione.SOTTOTITOLO_LISTA}</p>
                </div>
                <Button onClick={() => setDraft(makeEmptyAbilitazione())}>{Constants.abilitazione.AGGIUNGI}</Button>
            </div>
            <AbilitazioniTable
                abilitazioni={visibili}
                onDetail={setDraft}
                onEdit={setDraft}
                onDelete={(a) => elimina(a)}
            />
            <div className="px-6 py-3 text-sm text-gray-500">
                {Constants.abilitazione.TOTALE} {visibili.length} {Constants.abilitazione.ABILITAZIONI_ASSOCIATE}
            </div>
        </div>
    )
}
