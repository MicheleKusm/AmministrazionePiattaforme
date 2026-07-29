import type { Column, ComunicazioneOnboarding, ComunicazioniTableProps } from "../../types/type"
import { TableCommon } from "../common/TableCommon"
import { IconActions } from "./RowActions"
import { IconaComunicazioneGlyph } from "../common/IconaComunicazione"
import { Constants } from "../../utils/Constants"

export function ComunicazioniTable({ comunicazioni, onEdit, onDelete }: ComunicazioniTableProps) {
    const columns: Column<ComunicazioneOnboarding>[] = [
        {
            header: Constants.abilitazioneTable.ORDINE,
            render: (c) => <span className="text-primary-600">{comunicazioni.indexOf(c) + 1}</span>
        },
        {
            header: Constants.abilitazioneTable.TITOLO,
            render: (c) => <span className="text-gray-800">{c.testo}</span>
        },
        {
            header: Constants.comunicazioneModal.ICONA_LABEL,
            render: (c) => (
                <span className="inline-flex items-center gap-2 text-gray-700">
                    {c.icona ? <IconaComunicazioneGlyph nome={c.icona} /> : null}
                    {c.icona}
                </span>
            )
        },
        {
            header: Constants.comunicazioneModal.TIPO_ICONA_LABEL,
            render: (c) => c.typeIcona ? <span className="text-gray-700">{c.typeIcona === "outline" ? Constants.comunicazioneModal.TIPO_ICONA_OUTLINE : Constants.comunicazioneModal.TIPO_ICONA_SOLID}</span> : null
        },
        {
            header: Constants.abilitazioneTable.AZIONI,
            render: (c) => (
                <IconActions
                    onEdit={() => onEdit(c)}
                    onDelete={() => onDelete(c)}
                />
            )
        }
    ]

    return (
        <TableCommon
            data={comunicazioni}
            columns={columns}
            keyExtractor={(c: ComunicazioneOnboarding) => c.id}
            emptyMessage={<p className="py-4 text-sm text-gray-500">{Constants.abilitazione.NESSUNA_COMUNICAZIONE}</p>}
        />
    )
}
