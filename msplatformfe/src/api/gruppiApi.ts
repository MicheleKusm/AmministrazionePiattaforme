import type { Gruppo } from "../types";

export async function fetchGruppi(idPiattaforma: number): Promise<Gruppo[]> {
    const response = await fetch(`/api/gruppi?piattaformaId=${idPiattaforma}`);
    if (!response.ok) {
        return [];
    }
    return (await response.json()) as Gruppo[];
}

export async function saveGruppo(idPiattaforma: number, gruppo: Gruppo): Promise<void> {
    const payload = {
        idPiattaforma,
        nome: gruppo.nome,
        descrizione: gruppo.descrizione,
        ruoliIds: gruppo.ruoliIds
    };
    const url = gruppo.id ? `/api/gruppi/${gruppo.id}` : "/api/gruppi";
    const method = gruppo.id ? "PUT" : "POST";
    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}
