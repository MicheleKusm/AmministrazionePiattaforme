import { Constants } from "../../utils/Constants";
import type { Piattaforma, TipoAbilitazione } from "../../types/types";

type PlatformTableProps = {
    rows: Piattaforma[];
    loading: boolean;
    onEdit: (piattaforma: Piattaforma) => void;
};

function AbilitazioneBadge({ tipo }: { tipo: TipoAbilitazione }) {
    if (tipo === "VERTICALE") {
        return <span className="badge badge-verticale">{Constants.labelAbilitazione.VERTICALE}</span>;
    }
    return <span className="badge badge-ticket">{Constants.labelAbilitazione.TICKET}</span>;
}

export function PlatformTable({ rows, loading, onEdit }: PlatformTableProps) {
    return (
        <table className="grid">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Canale</th>
                    <th>Objclass</th>
                    <th>Abilitazione</th>
                    <th>In sola lettura</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                {loading && (
                    <tr>
                        <td colSpan={6}>Caricamento...</td>
                    </tr>
                )}
                {!loading &&
                    rows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.nome}</td>
                            <td>{row.canale}</td>
                            <td>{row.objClass}</td>
                            <td>
                                <AbilitazioneBadge tipo={row.abilitazione} />
                            </td>
                            <td>{row.readOnly ? Constants.common.SI : Constants.common.NO}</td>
                            <td>
                                <button className="btn-secondary" onClick={() => onEdit(row)} type="button">
                                    {Constants.common.MODIFICA}
                                </button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
}
