import { useState } from "react"
import type { Ruolo } from "../../types/type"

type GruppiPaginatiProps = {
    ruoli: Ruolo[]
    selectedIds: number[]
    onToggle: (id: number) => void
    rows?: number
    columns?: number
}

export function GruppiPaginati({ ruoli, selectedIds, onToggle, rows = 5, columns = 3 }: GruppiPaginatiProps) {
    const itemsPerPage = rows * columns
    const totalPages = Math.ceil(ruoli.length / itemsPerPage)
    const [page, setPage] = useState(0)

    const start = page * itemsPerPage
    const end = Math.min(start + itemsPerPage, ruoli.length)
    const visibleRoles = ruoli.slice(start, end)

    return (
        <div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                {" "}
                {/* 👈 Removed min-h */}
                {ruoli.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 col-span-3">Nessun ruolo disponibile.</p>
                ) : (
                    <>
                        {visibleRoles.map((ruolo) => {
                            const isChecked = selectedIds.includes(ruolo.id)
                            return (
                                <label
                                    key={ruolo.id}
                                    className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => onToggle(ruolo.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 shrink-0"
                                    />
                                    <span>{ruolo.nome}</span>
                                </label>
                            )
                        })}
                        {Array.from({ length: itemsPerPage - visibleRoles.length }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                    </>
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        ← Precedente
                    </button>
                    <span className="text-sm text-gray-500">
                        Pagina {page + 1} di {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        Successivo →
                    </button>
                </div>
            )}
        </div>
    )
}
