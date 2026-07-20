import { useMemo, useState } from "react";
import { Pagination } from "../components/platform-list/Pagination";
import { PlatformTable } from "../components/platform-list/PlatformTable";
import { useAppSelector } from "../store/hooks";
import { Constants } from "../utils/Constants";
import type { Piattaforma } from "../types/types";

type PlatformListPageProps = {
    onCreate: () => void;
    onEdit: (piattaforma: Piattaforma) => void;
};

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

    const totalPages = Math.max(Math.ceil(filtered.length / Constants.pageSize), 1);
    const currentPage = Math.min(page, totalPages - 1);
    const start = currentPage * Constants.pageSize;
    const rows = filtered.slice(start, start + Constants.pageSize);

    return (
        <>
            <section className="toolbar">
                <input
                    onChange={(e) => {
                        setPage(0);
                        setSearch(e.target.value);
                    }}
                    placeholder={Constants.common.CERCA_PIATTAFORMA}
                    value={search}
                />
                <button className="btn-primary" onClick={onCreate} type="button">
                    {Constants.common.AGGIUNGI_PIATTAFORMA}
                </button>
            </section>

            <PlatformTable loading={false} onEdit={onEdit} rows={rows} />

            <Pagination
                currentPage={currentPage}
                onNext={() => setPage((p) => p + 1)}
                onPrev={() => setPage((p) => p - 1)}
                totalPages={totalPages}
            />
        </>
    );
}
