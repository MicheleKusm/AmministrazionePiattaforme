import type { RuoliStepProps } from "../../types/type"
import { useGetRuoliAllQuery } from "../../api/ruoliApi"
import { RuoliTable } from "../../components/tables/RuoliTable"

export function RuoliStep({ onAdd, onEdit, onDelete }: RuoliStepProps) {
    const { data: ruoli = [], isLoading } = useGetRuoliAllQuery();

    if (isLoading) return <p>Caricamento ruoli...</p>

    return (
        <section className="card">
            <div className="flex justify-between items-center mb-4">
                <h3>Ruoli piattaforma</h3>
                <button className="btn-primary" onClick={onAdd} type="button">
                    Aggiungi ruolo
                </button>
            </div>
            <RuoliTable ruoli={ruoli} onEdit={onEdit} onDelete={onDelete} />
        </section>
    )
}
