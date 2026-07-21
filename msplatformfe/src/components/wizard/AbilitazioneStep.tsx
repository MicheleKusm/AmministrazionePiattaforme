import { useState } from "react";
import type { Abilitazione, Piattaforma } from "../../types/type";
import { makeEmptyAbilitazione } from "../../types/type";
import { Button } from "../common/Button";
import { AbilitazioniTable } from "../tables/AbilitazioniTable";
import { AbilitazioneForm } from "./AbilitazioneForm";
import { mockAbilitazioni, mockProcessiVerticali, mockTipologicheCampi } from "../../store/mockAbilitazione";
import { Constants } from "../../utils/Constants";

type AbilitazioneStepProps = {
    piattaforma?: Piattaforma;
};

function nextId(items: Abilitazione[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function AbilitazioneStep({ piattaforma }: AbilitazioneStepProps) {
    const [abilitazioni, setAbilitazioni] = useState<Abilitazione[]>(mockAbilitazioni);
    const [draft, setDraft] = useState<Abilitazione | null>(null);

    function salva(abilitazione: Abilitazione) {
        setAbilitazioni((prev) => {
            const esiste = prev.some((a) => a.id === abilitazione.id && abilitazione.id !== 0);
            if (esiste) {
                return prev.map((a) => (a.id === abilitazione.id ? abilitazione : a));
            }
            return [...prev, { ...abilitazione, id: nextId(prev) }];
        });
        setDraft(null);
    }

    if (draft) {
        return (
            <AbilitazioneForm
                piattaforma={piattaforma}
                initial={draft}
                tipologiche={mockTipologicheCampi}
                processi={mockProcessiVerticali}
                onCancel={() => setDraft(null)}
                onNew={() => setDraft(makeEmptyAbilitazione())}
                onSave={salva}
            />
        );
    }

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{Constants.abilitazione.TITOLO_LISTA}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{Constants.abilitazione.SOTTOTITOLO_LISTA}</p>
                </div>
                <Button onClick={() => setDraft(makeEmptyAbilitazione())}>{Constants.abilitazione.AGGIUNGI}</Button>
            </div>
            <AbilitazioniTable
                abilitazioni={abilitazioni}
                onDetail={setDraft}
                onEdit={setDraft}
                onDelete={(a) => setAbilitazioni((prev) => prev.filter((x) => x.id !== a.id))}
            />
            <div className="px-6 py-3 text-sm text-gray-500">
                {Constants.abilitazione.TOTALE} {abilitazioni.length} {Constants.abilitazione.ABILITAZIONI_ASSOCIATE}
            </div>
        </div>
    );
}
