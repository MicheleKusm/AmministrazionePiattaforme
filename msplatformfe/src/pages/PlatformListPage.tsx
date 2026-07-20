import { useEffect, useMemo, useState } from "react";
import { fetchPiattaforme } from "../api/piattaformeApi";
import { Pagination } from "../components/platform-list/Pagination";
import { PlatformTable } from "../components/platform-list/PlatformTable";
import type { PageResponse, Piattaforma } from "../types";

type PlatformListPageProps = {
    onCreate: () => void;
    onEdit: (piattaforma: Piattaforma) => void;
};

const PAGE_SIZE = 5;

export function PlatformListPage({ onCreate, onEdit }: PlatformListPageProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [platformPage, setPlatformPage] = useState<PageResponse<Piattaforma>>({
        content: [],
        number: 0,
        size: PAGE_SIZE,
        totalElements: 0,
        totalPages: 0
    });

    useEffect(() => {
        void load();
    }, [page, search]);

    async function load() {
        setLoading(true);
        const data = await fetchPiattaforme(search, page, PAGE_SIZE);
        setPlatformPage(data);
        setLoading(false);
    }

    const tableRows = useMemo(() => platformPage.content ?? [], [platformPage]);

    return (
        <>
            <section className="toolbar">
                <input
                    onChange={(e) => {
                        setPage(0);
                        setSearch(e.target.value);
                    }}
                    placeholder="Cerca piattaforma..."
                    value={search}
                />
                <button className="btn-primary" onClick={onCreate} type="button">
                    Aggiungi piattaforma
                </button>
            </section>

            <PlatformTable loading={loading} onEdit={onEdit} rows={tableRows} />

            <Pagination
                currentPage={platformPage.number}
                onNext={() => setPage((p) => p + 1)}
                onPrev={() => setPage((p) => p - 1)}
                totalPages={platformPage.totalPages}
            />
        </>
    );
}
