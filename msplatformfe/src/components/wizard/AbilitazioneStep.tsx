import { useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import type { Abilitazione, Piattaforma } from "../../types/type"
import { makeEmptyAbilitazione } from "../../types/type"
import { Button } from "../common/Button"
import { AbilitazioniTable } from "../tables/AbilitazioniTable"
import { AbilitazioneForm } from "./AbilitazioneForm"
import {
    useDeleteAbilitazioneMutation,
    useGetAbilitazioniQuery,
    useGetProcessiVerticaliQuery,
    useGetTipologicheQuery,
    useSaveAbilitazioneMutation
} from "../../api/abilitazioniApi"
import { Constants } from "../../utils/Constants"

type AbilitazioneStepProps = {
    piattaforma?: Piattaforma
}

export function AbilitazioneStep({ piattaforma }: AbilitazioneStepProps) {
    const [draft, setDraft] = useState<Abilitazione | null>(null)

    const { data: abilitazioni = [] } = useGetAbilitazioniQuery(piattaforma?.id ?? skipToken)
    const { data: tipologiche = [] } = useGetTipologicheQuery()
    const { data: processi = [] } = useGetProcessiVerticaliQuery()
    const [saveAbilitazione] = useSaveAbilitazioneMutation()
    const [deleteAbilitazione] = useDeleteAbilitazioneMutation()

    async function salva(abilitazione: Abilitazione) {
        if (piattaforma?.id) {
            await saveAbilitazione({ idPiattaforma: piattaforma.id, abilitazione }).unwrap()
        }
        setDraft(null)
    }

    async function elimina(abilitazione: Abilitazione) {
        if (abilitazione.id) {
            await deleteAbilitazione(abilitazione.id).unwrap()
        }
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
                abilitazioni={abilitazioni}
                onDetail={setDraft}
                onEdit={setDraft}
                onDelete={(a) => void elimina(a)}
            />
            <div className="px-6 py-3 text-sm text-gray-500">
                {Constants.abilitazione.TOTALE} {abilitazioni.length} {Constants.abilitazione.ABILITAZIONI_ASSOCIATE}
            </div>
        </div>
    )
}
