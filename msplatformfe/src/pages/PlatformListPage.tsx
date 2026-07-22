import { useState, useEffect, useMemo } from "react"
import { useGetAllPiattaformeQuery } from "../api/piattaformeApi"
import { PlatformTable } from "../components/tables/PlatformTable"
import { Pagination } from "../components/platform-list/Pagination"
import { Button } from "../components/common/Button"
import type { PlatformListPageProps } from "../types/type"
import { Constants } from "../utils/Constants"
import { useAppDispatch } from "../store/hooks"
import { setPiattaforme } from "../store/piattaformeSlice"

const PAGE_SIZE = Constants.common.PAGE_SIZE

export function PlatformListPage({ onCreate, onEdit }: PlatformListPageProps) {
    const dispatch = useAppDispatch()
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const { data: allPlatforms, isLoading, error } = useGetAllPiattaformeQuery(undefined, {
        refetchOnMountOrArgChange: true
    })

    useEffect(() => {
        if (allPlatforms) {
            dispatch(setPiattaforme(allPlatforms))
        }
    }, [allPlatforms, dispatch])

    const platforms = allPlatforms ?? []

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return platforms
        return platforms.filter((p) => p.nome.toLowerCase().includes(term) || p.objClass.toLowerCase().includes(term))
    }, [platforms, search])

    const totalElements = filtered.length
    const totalPages = Math.max(Math.ceil(totalElements / PAGE_SIZE), 1)
    const currentPage = Math.min(page, totalPages - 1)
    const start = currentPage * PAGE_SIZE
    const rows = filtered.slice(start, start + PAGE_SIZE)

    useEffect(() => {
        setPage(0)
    }, [search])

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
                        onChange={(e) => setSearch(e.target.value)}
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
                        Mostra {totalElements === 0 ? 0 : start + 1} – {Math.min(start + PAGE_SIZE, totalElements)} di {totalElements} risultati
                    </span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={() => setPage((p) => Math.max(0, p - 1))}
                        onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    />
                </div>
            </div>
        </div>
    )
}
