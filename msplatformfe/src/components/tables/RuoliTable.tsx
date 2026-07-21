import type { RuoliTableProps, Ruolo } from "../../types/type"
import { Badge } from "../common/Badge"
import { TableCommon } from "../../components/common/TableCommon"

const ICON_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"

export function RuoliTable({ ruoli, onEdit, onDelete, piattaformaId }: RuoliTableProps) {
    const visibleRuoli = ruoli.filter((r) => !r.daEliminare)
    const sortedRuoli = [...visibleRuoli].sort((a, b) => a.id - b.id)

    const columns = [
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
            render: (ruolo: Ruolo) => (
                <span className="text-gray-700">{ruolo.richiedibileDaProcesso ? <Badge tone="green">Sì</Badge> : <Badge tone="gray">No</Badge>}</span>
            )
        },
        {
            header: "Azioni",
            render: (ruolo: Ruolo) => (
                <div className="flex gap-2">
                    <button
                        type="button"
                        aria-label="Modifica"
                        onClick={() => onEdit(ruolo)}
                        className={ICON_BTN}>
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Elimina"
                        onClick={() => onDelete(ruolo)}
                        className={`${ICON_BTN} hover:border-red-300 hover:text-red-600`}>
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                        </svg>
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
