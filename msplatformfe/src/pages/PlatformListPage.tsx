import { useState } from "react"
import { useGetPiattaformeQuery } from "../api/piattaformeApi"
import { PlatformTable } from "../components/tables/PlatformTable"
import { Pagination } from "../components/platform-list/Pagination"
import { Button } from "../components/common/Button"
import type { PlatformListPageProps } from "../types/type"
import { Constants } from "../utils/Constants"

const PAGE_SIZE = Constants.common.PAGE_SIZE

export function PlatformListPage({ onCreate, onEdit }: PlatformListPageProps) {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)

    // Fetch data from the backend (paginated + search)
    const { data, isLoading, error } = useGetPiattaformeQuery({
        search,
        page,
        size: PAGE_SIZE
    })

    // Extract data from the response
    const rows = data?.content ?? []
    const totalElements = data?.totalElements ?? 0
    const totalPages = data?.totalPages ?? 1

    // Handle loading and error states
    if (isLoading) {
        return <p className="p-6 text-gray-500">Caricamento piattaforme...</p>
    }
    if (error) {
        return <p className="p-6 text-red-500">Errore nel caricamento delle piattaforme.</p>
    }

    return (
        <div>
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Modifica Configurazione</h1>
                    <p className="mt-1 text-sm text-gray-500">Gestisci le piattaforme configurate e accedi rapidamente alle impostazioni.</p>
                </div>
                <Button onClick={onCreate}>+ Aggiungi piattaforma</Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-900">Piattaforme configurate</h3>
                    <input
                        value={search}
                        onChange={(e) => {
                            setPage(0) // reset to first page when searching
                            setSearch(e.target.value)
                        }}
                        placeholder="Cerca piattaforme..."
                        className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
                    />
                </div>

                <PlatformTable
                    rows={rows}
                    onEdit={onEdit}
                />

                <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
                    <span>
                        Mostra {totalElements === 0 ? 0 : page * PAGE_SIZE + 1} – {Math.min((page + 1) * PAGE_SIZE, totalElements)} di {totalElements}{" "}
                        risultati
                    </span>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPrev={() => setPage((p) => Math.max(0, p - 1))}
                        onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    />
                </div>
            </div>
        </div>
    )
}
