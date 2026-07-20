import type { Gruppo } from "../../types/type"

type GruppiStepProps = {
    gruppi: Gruppo[];
    onAdd: () => void;
    onEdit: (gruppo: Gruppo) => void;
    onDelete: (gruppo: Gruppo) => void;
};

export function GruppiStep({ gruppi, onAdd, onEdit, onDelete }: GruppiStepProps) {
    return (
        <section className="card">
            <h3>Gruppi operativi</h3>
            <button className="btn-primary" onClick={onAdd} type="button">
                Aggiungi gruppo
            </button>
            <ul>
                {gruppi.map((g, idx) => (
                    <li key={g.id ?? idx}>
                        <strong>{g.nome}</strong> - {g.descrizione}
                        <button className="btn-secondary" onClick={() => onEdit(g)} type="button">
                            Modifica
                        </button>
                        <button className="btn-danger" onClick={() => onDelete(g)} type="button">
                            Elimina
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
