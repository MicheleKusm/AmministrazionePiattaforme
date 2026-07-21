import type { Abilitazione, AbilitazioniTableProps, Column } from "../../types/type";
import { Badge } from "../common/Badge";
import { TableCommon } from "../common/TableCommon";
import { Constants } from "../../utils/Constants";

const ACTION_BTN = "rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors";

export function AbilitazioniTable({ abilitazioni, onDetail, onEdit, onDelete }: AbilitazioniTableProps) {
    const columns: Column<Abilitazione>[] = [
        {
            header: Constants.abilitazioneTable.NOME,
            render: (a) => <span className="font-semibold text-gray-900">{a.nome}</span>
        },
        {
            header: Constants.abilitazioneTable.TIPO,
            render: (a) =>
                a.tipo === "VERTICALE" ? (
                    <Badge tone="green">{Constants.labelAbilitazione.VERTICALE}</Badge>
                ) : (
                    <Badge tone="blue">{Constants.labelAbilitazione.TICKET}</Badge>
                )
        },
        {
            header: Constants.abilitazioneTable.RIFERIMENTO,
            render: (a) => <span className="text-gray-700">{a.riferimento}</span>
        },
        {
            header: Constants.abilitazioneTable.STATO,
            render: (a) => <Badge tone="green">{a.stato}</Badge>
        },
        {
            header: Constants.abilitazioneTable.AZIONI,
            render: (a) => (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onDetail(a)}
                        className={`${ACTION_BTN} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}>
                        {Constants.abilitazione.DETTAGLIO}
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(a)}
                        className={`${ACTION_BTN} border-primary-200 bg-white text-primary-700 hover:bg-primary-50`}>
                        {Constants.abilitazione.MODIFICA}
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(a)}
                        className={`${ACTION_BTN} border-red-200 bg-white text-red-600 hover:bg-red-50`}>
                        {Constants.abilitazione.ELIMINA}
                    </button>
                </div>
            )
        }
    ];

    return (
        <TableCommon
            data={abilitazioni}
            columns={columns}
            keyExtractor={(a: Abilitazione) => a.id}
            emptyMessage={<p className="px-6 py-4 text-sm text-gray-500">{Constants.abilitazione.NESSUNA}</p>}
        />
    );
}
