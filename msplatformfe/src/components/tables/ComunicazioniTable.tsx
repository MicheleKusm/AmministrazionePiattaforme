import type { Column, ComunicazioneOnboarding, ComunicazioniTableProps } from "../../types/type";
import { TableCommon } from "../common/TableCommon";
import { IconActions, RequiredMark } from "./RowActions";
import { Constants } from "../../utils/Constants";

export function ComunicazioniTable({ comunicazioni, onEdit, onDelete }: ComunicazioniTableProps) {
    const columns: Column<ComunicazioneOnboarding>[] = [
        {
            header: Constants.abilitazioneTable.ORDINE,
            render: (c) => <span className="text-primary-600">{comunicazioni.indexOf(c) + 1}</span>
        },
        {
            header: Constants.abilitazioneTable.TITOLO,
            render: (c) => <span className="text-gray-800">{c.descrizione}</span>
        },
        {
            header: Constants.abilitazioneTable.CANALE,
            render: (c) => <span className="text-gray-700">{c.canale}</span>
        },
        {
            header: Constants.abilitazioneTable.OBBLIGATORIA,
            render: (c) => <RequiredMark value={c.obbligatoria} />
        },
        {
            header: Constants.abilitazioneTable.AZIONI,
            render: (c) => <IconActions onEdit={() => onEdit(c)} onDelete={() => onDelete(c)} />
        }
    ];

    return (
        <TableCommon
            data={comunicazioni}
            columns={columns}
            keyExtractor={(c: ComunicazioneOnboarding) => c.id}
            emptyMessage={<p className="py-4 text-sm text-gray-500">{Constants.abilitazione.NESSUNA_COMUNICAZIONE}</p>}
        />
    );
}
