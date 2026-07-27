import type { GruppiStepProps } from "../../types/type"
import { GruppiTable } from "../tables/GruppiTable"
import { Button } from "../common/Button"

export function GruppiStep({ gruppi, ruoli, onAdd, onEdit, onDelete }: GruppiStepProps) {
    const visibleGruppi = gruppi.filter((g) => !g.daEliminare)

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Gruppi della piattaforma</h3>
                    <p className="mt-0.5 text-sm text-gray-500">Definisci e gestisci i gruppi disponibili per questa piattaforma.</p>
                </div>
                <Button onClick={onAdd}>+ Aggiungi gruppo</Button>
            </div>
            <GruppiTable
                gruppi={gruppi}
                ruoli={ruoli}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            <div className="px-6 py-3 text-sm text-gray-500">Totale {visibleGruppi.length} gruppi</div>
        </div>
    )
}
