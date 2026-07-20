import type { Ruolo } from "../../types";
import { useEffect, useState } from "react";
import { Constants } from "../../utils/Constants"
import { RuoliTable} from "../../components/tables/RuoliTable"

type RuoliStepProps = {
    onAdd: () => void;
    onEdit: (ruolo: Ruolo) => void;
    onDelete: (ruolo: Ruolo) => void;
};

export function RuoliStep({ onAdd, onEdit, onDelete }: RuoliStepProps) {
    const [ruoli, setRuoli] = useState<Ruolo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRuoli = async () => {
            try {
                const response = await fetch(Constants.api.API_RUOLI_ALL);
                if (!response.ok) throw new Error("Errore nel caricamento dei ruoli");
                const data = await response.json();
                setRuoli(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRuoli();
    }, []);

    if (loading) return <p>Caricamento ruoli...</p>

    return (
        <section className="card">
            <div className="flex justify-between items-center mb-4">
                <h3>Ruoli piattaforma</h3>
                <button
                    className="btn-primary"
                    onClick={onAdd}
                    type="button">
                    Aggiungi ruolo
                </button>
            </div>
            <RuoliTable
                ruoli={ruoli}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </section>
    )
}
