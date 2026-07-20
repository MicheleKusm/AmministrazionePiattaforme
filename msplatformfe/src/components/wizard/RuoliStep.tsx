import type { Ruolo } from "../../types";

type RuoliStepProps = {
    ruoli: Ruolo[];
    onAdd: () => void;
    onEdit: (ruolo: Ruolo) => void;
    onDelete: (ruolo: Ruolo) => void;
};

export function RuoliStep({ ruoli, onAdd, onEdit, onDelete }: RuoliStepProps) {
    return (
        <section className="card">
            <h3>Ruoli piattaforma</h3>
            <button className="btn-primary" onClick={onAdd} type="button">
                Aggiungi ruolo
            </button>
            <ul>
                {ruoli.map((r, idx) => (
                    <li key={r.id ?? idx}>
                        <strong>{r.nome}</strong> - {r.descrizione}
                        <button className="btn-secondary" onClick={() => onEdit(r)} type="button">
                            Modifica
                        </button>
                        <button className="btn-danger" onClick={() => onDelete(r)} type="button">
                            Elimina
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
