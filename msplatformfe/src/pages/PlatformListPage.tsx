import { useMemo, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { PlatformTable } from "../components/tables/PlatformTable";
import { Pagination } from "../components/platform-list/Pagination";
import { Button } from "../components/common/Button";
import type { Piattaforma } from "../types/type";

type PlatformListPageProps = {
    onCreate: () => void;
    onEdit: (piattaforma: Piattaforma) => void;
};

const PAGE_SIZE = 5;

export function PlatformListPage({ onCreate, onEdit }: PlatformListPageProps) {
    const items = useAppSelector((state) => state.piattaforme.items);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) {
            return items;
        }
        return items.filter((p) => p.nome.toLowerCase().includes(term) || p.objClass.toLowerCase().includes(term));
    }, [items, search]);

    const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
    const currentPage = Math.min(page, totalPages - 1);
    const start = currentPage * PAGE_SIZE;
    const rows = filtered.slice(start, start + PAGE_SIZE);

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
                            setPage(0);
                            setSearch(e.target.value);
                        }}
                        placeholder="Cerca piattaforme..."
                        className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
                    />
                </div>

                <PlatformTable rows={rows} onEdit={onEdit} />

                <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
                    <span>Mostra {filtered.length === 0 ? 0 : start + 1}-{start + rows.length} di {filtered.length} risultati</span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={() => setPage((p) => p - 1)}
                        onNext={() => setPage((p) => p + 1)}
                    />
                </div>
            </div>
        </div>
    );
}
