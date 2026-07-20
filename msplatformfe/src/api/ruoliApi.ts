import type { Ruolo } from "../types";

export async function fetchRuoli(idPiattaforma: number): Promise<Ruolo[]> {
    const response = await fetch(`/api/ruoli?piattaformaId=${idPiattaforma}`);
    if (!response.ok) {
        return [];
    }
    return (await response.json()) as Ruolo[];
}

export async function saveRuolo(idPiattaforma: number, ruolo: Ruolo): Promise<void> {
    const payload = {
        idPiattaforma,
        nome: ruolo.nome,
        descrizione: ruolo.descrizione,
        richiedibileDaProcesso: ruolo.richiedibileDaProcesso
    };
    const url = ruolo.id ? `/api/ruoli/${ruolo.id}` : "/api/ruoli";
    const method = ruolo.id ? "PUT" : "POST";
    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}
