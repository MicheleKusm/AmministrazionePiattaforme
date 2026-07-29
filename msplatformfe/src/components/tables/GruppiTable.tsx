import { Badge } from "../common/Badge"
import { TableCommon } from "../../components/common/TableCommon"
import type { Column, Gruppo, Ruolo } from "../../types/type"
import { Constants } from "../../utils/Constants"

type GruppiTableProps = {
    gruppi: Gruppo[]
    ruoli: Ruolo[]
    onEdit: (gruppo: Gruppo) => void
    onDelete: (gruppo: Gruppo) => void
}

const ACTION_BTN = Constants.common.ACTION_BTN

export function GruppiTable({ gruppi, ruoli, onEdit, onDelete }: GruppiTableProps) {
    const visibleGruppi = gruppi.filter((g) => !g.daEliminare)
    const platformRuoloIds = new Set(ruoli.map((r) => r.id))

    const filteredCount = (gruppo: Gruppo) => {
        if (!gruppo.ruoliIds) return 0
        return gruppo.ruoliIds.filter((id) => platformRuoloIds.has(id)).length
    }

    const columns: Column<Gruppo>[] = [
        {
            header: "Nome",
            render: (gruppo) => <span className="font-semibold text-gray-900">{gruppo.nome}</span>
        },
        {
            header: "Descrizione",
            render: (gruppo) => <span className="text-gray-700">{gruppo.descrizione}</span>
        },
        {
            header: "Ruoli nel gruppo",
            align: "center",
            render: (gruppo) => <Badge tone="gray">{filteredCount(gruppo)} ruoli</Badge>
        },
        {
            header: "Azioni",
            align: "center",
            render: (gruppo) => (
                <div className="flex flex-nowrap justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(gruppo)}
                        className={`${ACTION_BTN} border-primary-200 bg-white text-primary-700 hover:bg-primary-50`}>
                        Modifica
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(gruppo)}
                        className={`${ACTION_BTN} border-primary-200 bg-white text-primary-700 hover:bg-primary-50`}>
                        Elimina
                    </button>
                </div>
            )
        }
    ]

    return (
        <TableCommon
            data={visibleGruppi}
            columns={columns}
            keyExtractor={(gruppo) => gruppo.id}
            emptyMessage="Nessun gruppo trovato."
        />
    )
}
