import { useRef, useState } from "react"
import debounce from "lodash/debounce"
import { useGetPiattaformeQuery } from "../api/piattaformeApi"
import { PlatformTable } from "../components/tables/PlatformTable"
import { Pagination } from "../components/platform-list/Pagination"
import { Button } from "../components/common/Button"
import type { PlatformListPageProps } from "../types/type"
import { Constants } from "../utils/Constants"
import diagrammaER from "../assets/imgs/diagrammaER.png"

const PAGE_SIZE = Constants.common.PAGE_SIZE

export function PlatformListPage({ onCreate, onEdit }: PlatformListPageProps) {
    const [inputValue, setInputValue] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const debouncedSetSearch = useRef(
        debounce((value: string) => {
            setSearch(value)
        }, 400)
    ).current

    const handleInputChange = (value: string) => {
        setInputValue(value)
        setPage(0)
        debouncedSetSearch(value)
    }

    const { data, isLoading, error } = useGetPiattaformeQuery({
        search,
        page,
        size: PAGE_SIZE
    })

    const rows = data?.content ?? []
    const totalElements = data?.totalElements ?? 0
    const totalPages = data?.totalPages ?? 1

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
                        value={inputValue}
                        onChange={(e) => {
                            handleInputChange(e.target.value)
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

            <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-900">Diagramma ER</h3>
                </div>
                <div className="px-6 pb-6">
                    <img src={diagrammaER} alt="Diagramma ER" className="w-full rounded-lg border border-gray-200" />
                </div>
            </div>
        </div>
    )
}
