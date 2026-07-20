import { useState } from "react";
import type { Gruppo, Ruolo } from "../../types/types";

type GroupModalProps = {
    group: Gruppo;
    ruoli: Ruolo[];
    onSave: (group: Gruppo) => void;
    onClose: () => void;
};

export function GroupModal({ group, ruoli, onSave, onClose }: GroupModalProps) {
    const [draft, setDraft] = useState<Gruppo>(group);

    function toggleRuolo(idRuolo?: number) {
        if (!idRuolo) {
            return;
        }
        const next = draft.ruoliIds.includes(idRuolo) ? draft.ruoliIds.filter((id) => id !== idRuolo) : [...draft.ruoliIds, idRuolo];
        setDraft({ ...draft, ruoliIds: next });
    }

    function submit(e: { preventDefault: () => void }) {
        e.preventDefault();
        onSave(draft);
    }

    return (
        <div className="modal-backdrop">
            <form className="modal" onSubmit={submit}>
                <h4>Aggiungi / Modifica gruppo</h4>
                <input onChange={(e) => setDraft({ ...draft, nome: e.target.value })} placeholder="Nome gruppo" required value={draft.nome} />
                <textarea onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })} placeholder="Descrizione" required value={draft.descrizione} />
                <div>
                    {ruoli.map((ruolo) => (
                        <label key={ruolo.id ?? ruolo.nome}>
                            <input checked={Boolean(ruolo.id && draft.ruoliIds.includes(ruolo.id))} onChange={() => toggleRuolo(ruolo.id)} type="checkbox" />
                            {ruolo.nome}
                        </label>
                    ))}
                </div>
                <div className="actions">
                    <button className="btn-secondary" onClick={onClose} type="button">
                        Annulla
                    </button>
                    <button className="btn-primary" type="submit">
                        Salva
                    </button>
                </div>
            </form>
        </div>
    );
}
