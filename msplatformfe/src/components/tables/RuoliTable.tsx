import type { Column, RuoliTableProps, Ruolo } from "../../types/type"
import { Badge } from "../common/Badge"
import { TableCommon } from "../../components/common/TableCommon"
import { Constants } from "../../utils/Constants"

const ICON_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
const ACTION_BTN = Constants.common.ACTION_BTN

export function RuoliTable({ ruoli, onEdit, onDelete, piattaformaId }: RuoliTableProps) {
    const visibleRuoli = ruoli.filter((r) => !r.daEliminare)
    const sortedRuoli = [...visibleRuoli].sort((a, b) => a.id - b.id)

    const columns: Column<Ruolo>[] = [
        {
            header: "Nome",
            render: (ruolo: Ruolo) => <span className="font-semibold text-gray-900">{ruolo.nome}</span>
        },
        {
            header: "Descrizione",
            render: (ruolo: Ruolo) => <span className="text-gray-700">{ruolo.descrizione}</span>
        },
        {
            header: "Richiedibile da processo",
            align: "center",
            render: (ruolo: Ruolo) => (
                <span className="text-gray-700">{ruolo.richiedibileDaProcesso ? <Badge tone="green">Sì</Badge> : <Badge tone="gray">No</Badge>}</span>
            )
        },
        {
            header: "Azioni",
            align: "center",
            render: (ruolo: Ruolo) => (
                <div className="flex flex-nowrap justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(ruolo)}
                        className={`${ACTION_BTN} border-primary-200 bg-white text-primary-700 hover:bg-primary-50`}>
                        Modifica
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(ruolo)}
                        className={`${ACTION_BTN} border-primary-200 bg-white text-primary-700 hover:bg-primary-50`}>
                        Elimina
                    </button>
                </div>
            )
        }
    ]

    return (
        <TableCommon
            data={sortedRuoli}
            columns={columns}
            keyExtractor={(ruolo: Ruolo) => ruolo.id}
            emptyMessage={piattaformaId !== undefined ? "Nessun ruolo trovato." : ""}
        />
    )
}
