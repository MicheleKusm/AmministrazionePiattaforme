import type { Gruppo } from "../../types/type";
import { Badge } from "../common/Badge";

type GruppiTableProps = {
    gruppi: Gruppo[];
    onEdit: (gruppo: Gruppo) => void;
    onDelete: (gruppo: Gruppo) => void;
};

const TH = "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500";
const TD = "px-6 py-4 text-sm text-gray-700";
const ICON_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"

export function GruppiTable({ gruppi, onEdit, onDelete }: GruppiTableProps) {
    const visibleGruppi = gruppi.filter((g) => !g.daEliminare)
    if (!visibleGruppi || visibleGruppi.length === 0) {
        return <p className="px-6 py-4 text-sm text-gray-500">Nessun gruppo trovato.</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className={TH}>Nome</th>
                        <th className={TH}>Descrizione</th>
                        <th className={TH}>Ruoli nel gruppo</th>
                        <th className={TH}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleGruppi.map((gruppo, idx) => (
                        <tr
                            key={gruppo.id ?? idx}
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className={`${TD} font-semibold text-gray-900`}>{gruppo.nome}</td>
                            <td className={TD}>{gruppo.descrizione}</td>
                            <td className={TD}>
                                <Badge tone="gray">{gruppo.ruoliIds.length} ruoli</Badge>
                            </td>
                            <td className={TD}>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        aria-label="Modifica"
                                        onClick={() => onEdit(gruppo)}
                                        className={ICON_BTN}>
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Elimina"
                                        onClick={() => onDelete(gruppo)}
                                        className={`${ICON_BTN} hover:border-red-300 hover:text-red-600`}>
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2">
                                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
