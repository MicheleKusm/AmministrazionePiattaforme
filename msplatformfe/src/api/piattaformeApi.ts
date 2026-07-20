import type { PageResponse, Piattaforma } from "../types/types";

export async function fetchPiattaforme(search: string, page: number, size: number): Promise<PageResponse<Piattaforma>> {
    const response = await fetch(`/api/piattaforme?search=${encodeURIComponent(search)}&page=${page}&size=${size}`);
    return (await response.json()) as PageResponse<Piattaforma>;
}

export async function savePiattaforma(piattaforma: Piattaforma): Promise<Piattaforma> {
    const method = piattaforma.id ? "PUT" : "POST";
    const url = piattaforma.id ? `/api/piattaforme/${piattaforma.id}` : "/api/piattaforme";
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(piattaforma)
    });
    return (await response.json()) as Piattaforma;
}
