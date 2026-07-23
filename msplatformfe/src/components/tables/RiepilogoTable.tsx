import { TableCommon } from "../../components/common/TableCommon"
import { useAppSelector } from "../../store/hooks"
import type { Piattaforma, Ruolo, Gruppo } from "../../types/type"

type RiepilogoRow = {
    id: string | number
    tipo: "Piattaforma" | "Ruolo" | "Gruppo" | "Abilitazione"
    nome: string
    descrizione: string
    stato: "Nuovo" | "Esistente" | "Eliminato"
}

export function RiepilogoTable() {
    const piattaforma = useAppSelector((state) => state.riepilogo.piattaforma)
    const ruoli = useAppSelector((state) => state.riepilogo.ruoli)
    const gruppi = useAppSelector((state) => state.riepilogo.gruppi)

    const rows: RiepilogoRow[] = []

    // Piattaforma
    if (piattaforma) {
        let stato: RiepilogoRow["stato"] = "Esistente"
        if (!piattaforma.id || piattaforma.id < 0) {
            stato = "Nuovo"
        }
        rows.push({
            id: "piattaforma",
            tipo: "Piattaforma",
            nome: piattaforma.nome,
            descrizione: piattaforma.descrizione,
            stato
        })
    }

    // Ruoli
    for (const ruolo of ruoli) {
        let stato: RiepilogoRow["stato"] = "Esistente"
        if (ruolo.daEliminare) {
            stato = "Eliminato"
        } else if (ruolo.id < 0) {
            stato = "Nuovo"
        }
        rows.push({
            id: ruolo.id,
            tipo: "Ruolo",
            nome: ruolo.nome,
            descrizione: ruolo.descrizione,
            stato
        })
    }

    // Gruppi
    for (const gruppo of gruppi) {
        let stato: RiepilogoRow["stato"] = "Esistente"
        if (gruppo.daEliminare) {
            stato = "Eliminato"
        } else if (gruppo.id && gruppo.id < 0) {
            stato = "Nuovo"
        }
        rows.push({
            id: gruppo.id ?? Math.random().toString(36),
            tipo: "Gruppo",
            nome: gruppo.nome,
            descrizione: gruppo.descrizione,
            stato
        })
    }

    const columns = [
        { header: "Tipo", render: (row: RiepilogoRow) => row.tipo },
        { header: "Nome", render: (row: RiepilogoRow) => row.nome },
        { header: "Descrizione", render: (row: RiepilogoRow) => row.descrizione },
        {
            header: "Stato",
            render: (row: RiepilogoRow) => {
                const colors = {
                    Nuovo: "text-green-600",
                    Esistente: "text-gray-600",
                    Eliminato: "text-red-600"
                }
                return <span className={colors[row.stato]}>{row.stato}</span>
            }
        }
    ]

    return (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Riepilogo configurazione</h3>
                <p className="text-sm text-gray-500">Verifica le modifiche prima di salvare.</p>
            </div>
            <TableCommon
                data={rows}
                columns={columns}
                keyExtractor={(row) => row.id}
                emptyMessage="Nessun dato da riepilogare."
            />
            <div className="px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
                Totale: {rows.length} elementi ({ruoli.filter((r) => r.daEliminare).length} eliminati)
            </div>
        </div>
    )
}
