import type { RuoliStepProps } from "../../types/type"
import { RuoliTable } from "../tables/RuoliTable"
import { Button } from "../common/Button"
import { useGetRuoliQuery } from "../../api/ruoliApi"

export function RuoliStep({ onAdd, onEdit, onDelete, piattaformaId }: RuoliStepProps) {

    const { data: ruoli = [], isLoading, error } = useGetRuoliQuery(piattaformaId!, {
        skip: piattaformaId === undefined
    })

    if (isLoading) return <p>Caricamento ruoli...</p>
    if (error) return <p className="text-red-500">Errore nel caricamento dei ruoli.</p>

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Ruoli della piattaforma</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                        {piattaformaId ? "Ruoli assegnati a questa piattaforma." : "Definisci e gestisci i ruoli disponibili per questa piattaforma."}
                    </p>
                </div>
                <Button onClick={onAdd}>+ Aggiungi ruolo</Button>
            </div>
            <RuoliTable
                ruoli={ruoli}
                onEdit={onEdit}
                onDelete={onDelete}
                piattaformaId={piattaformaId}
            />
            <div className="px-6 py-3 text-sm text-gray-500">Totale {ruoli.length} ruoli</div>
        </div>
    )
}
