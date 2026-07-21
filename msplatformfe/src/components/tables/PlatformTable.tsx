import type { Piattaforma } from "../../types/type";
import { Badge } from "../common/Badge";

type PlatformTableProps = {
    rows: Piattaforma[];
    onEdit: (piattaforma: Piattaforma) => void;
};

const TH = "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500";
const TD = "px-6 py-4 text-sm text-gray-700";

export function PlatformTable({ rows, onEdit }: PlatformTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className={TH}>Nome</th>
                        <th className={TH}>Canale</th>
                        <th className={TH}>Objclass</th>
                        <th className={TH}>Abilitazione</th>
                        <th className={TH}>In sola lettura</th>
                        <th className={TH}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 && (
                        <tr>
                            <td className={TD} colSpan={6}>Nessuna piattaforma trovata</td>
                        </tr>
                    )}
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className={`${TD} font-semibold text-gray-900`}>{row.nome}</td>
                            <td className={TD}>{row.canale}</td>
                            <td className={TD}>{row.objClass}</td>
                            <td className={TD}>
                                {row.abilitazione === "VERTICALE" ? <Badge tone="green">Verticale</Badge> : <Badge tone="blue">Ticket</Badge>}
                            </td>
                            <td className={TD}>{row.readOnly ? <Badge tone="orange">Sì</Badge> : <Badge tone="gray">No</Badge>}</td>
                            <td className={TD}>
                                <button
                                    type="button"
                                    onClick={() => onEdit(row)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                    Modifica
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
