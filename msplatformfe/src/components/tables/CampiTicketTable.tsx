import type { CampiTicketTableProps, CampoTicket, Column } from "../../types/type";
import { TableCommon } from "../common/TableCommon";
import { IconActions, RequiredMark } from "./RowActions";
import { Constants } from "../../utils/Constants";

export function CampiTicketTable({ campi, onEdit, onDelete }: CampiTicketTableProps) {
    const columns: Column<CampoTicket>[] = [
        {
            header: Constants.abilitazioneTable.ORDINE,
            render: (c) => <span className="text-primary-600">{campi.indexOf(c) + 1}</span>
        },
        {
            header: Constants.abilitazioneTable.LABEL,
            render: (c) => <span className="text-gray-800">{c.label}</span>
        },
        {
            header: Constants.abilitazioneTable.CAMPO,
            render: (c) => <span className="font-mono text-xs text-gray-600">{c.key}</span>
        },
        {
            header: Constants.abilitazioneTable.OBBLIGATORIA,
            render: (c) => <RequiredMark value={c.required} />
        },
        {
            header: Constants.abilitazioneTable.AZIONI,
            render: (c) => <IconActions onEdit={() => onEdit(c)} onDelete={() => onDelete(c)} />
        }
    ];

    return (
        <TableCommon
            data={campi}
            columns={columns}
            tableClassName="table-fixed w-full"
            colWidths={["8%", "20%", "34%", "20%", "18%"]}
            keyExtractor={(c: CampoTicket) => c.id}
            emptyMessage={<p className="py-4 text-sm text-gray-500">{Constants.abilitazione.NESSUN_CAMPO}</p>}
        />
    );
}
