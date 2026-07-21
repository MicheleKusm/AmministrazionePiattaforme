import type { Column, Ruolo } from "../../types/type"
import { TableCommon } from "../../components/common/TableCommon"

type RuoliTableProps = {
    ruoli: Ruolo[]
    onEdit: (ruolo: Ruolo) => void
    onDelete: (ruolo: Ruolo) => void
}

export function RuoliTable({ ruoli, onEdit, onDelete }: RuoliTableProps) {
    if (!ruoli || ruoli.length === 0) {
        return <p>Nessun ruolo trovato.</p>
    }

    const sortedRuoli = [...ruoli].sort((a, b) => a.id - b.id)

    const columns: Column<Ruolo>[] = [
        { header: "ID", render: (r) => <span>{r.id}</span> },
        { header: "Nome", render: (r) => <strong>{r.nome}</strong> },
        { header: "Descrizione", render: (r) => <span>{r.descrizione}</span> },
        {
            header: "Azioni",
            render: (r) => (
                <div className="flex gap-3">
                    <button
                        className="btn-secondary"
                        onClick={() => onEdit(r)}
                        type="button">
                        Modifica
                    </button>
                    <button
                        className="btn-danger"
                        onClick={() => onDelete(r)}
                        type="button">
                        Elimina
                    </button>
                </div>
            )
        }
    ]

    return (
        <TableCommon<Ruolo>
            data={sortedRuoli}
            columns={columns}
            keyExtractor={(r) => r.id}
            emptyMessage="Nessun ruolo trovato."
            className="ruoli-table"
        />
    )
}
