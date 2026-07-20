import type { Ruolo } from "../../types/types"

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

    return (
        <div className="ruoli-table overflow-x-auto">
            {" "}
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                            Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                            Descrizione
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                            Azioni
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedRuoli.map((ruolo) => (
                        <tr key={ruolo.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{ruolo.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                <strong>{ruolo.nome}</strong>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{ruolo.descrizione}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-200">
                                <div className="flex gap-3">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => onEdit(ruolo)}
                                        type="button">
                                        Modifica
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => onDelete(ruolo)}
                                        type="button">
                                        Elimina
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
