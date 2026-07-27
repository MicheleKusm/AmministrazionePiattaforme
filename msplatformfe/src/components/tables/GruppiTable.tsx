import { Badge } from "../common/Badge"
import { TableCommon } from "../../components/common/TableCommon"
import type { Column, Gruppo, Ruolo } from "../../types/type"

type GruppiTableProps = {
    gruppi: Gruppo[]
    ruoli: Ruolo[]
    onEdit: (gruppo: Gruppo) => void
    onDelete: (gruppo: Gruppo) => void
}

const ICON_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"

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
            header: "Ruoli nel gruppo (solo per questa piattaforma)",
            render: (gruppo) => <Badge tone="gray">{filteredCount(gruppo)} ruoli</Badge>
        },
        {
            header: "Azioni",
            render: (gruppo) => (
                <div className="flex gap-2">
                    <button
                        type="button"
                        aria-label="Modifica"
                        onClick={() => onEdit(gruppo)}
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
                        onClick={() => onDelete(gruppo)}
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
            data={visibleGruppi}
            columns={columns}
            keyExtractor={(gruppo) => gruppo.id}
            emptyMessage="Nessun gruppo trovato."
        />
    )
}
