import { useState, useEffect } from "react";
import type { Ruolo } from "../../types/types"

type RoleModalProps = {
    role: Ruolo;
    onSave: (role: Ruolo) => void;
    onClose: () => void;
};

export function RoleModal({ role, onSave, onClose }: RoleModalProps) {
    const [draft, setDraft] = useState<Ruolo>(role);

    function submit(e: { preventDefault: () => void }) {
        e.preventDefault()
        onSave(draft)
    }

    useEffect(() => {
        setDraft(role)
    }, [role])

    return (
        <div className="modal-backdrop">
            <form className="modal" onSubmit={submit}>
                <h4>Aggiungi / Modifica ruolo</h4>
                <input onChange={(e) => setDraft({ ...draft, nome: e.target.value })} placeholder="Nome" required value={draft.nome} />
                <textarea onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })} placeholder="Descrizione" required value={draft.descrizione} />
                <label>
                    <input
                        checked={draft.richiedibileDaProcesso}
                        onChange={(e) => setDraft({ ...draft, richiedibileDaProcesso: e.target.checked })}
                        type="checkbox"
                    />
                    Richiedibile da processo
                </label>
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
