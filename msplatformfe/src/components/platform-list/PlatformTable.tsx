import type { Piattaforma } from "../../types";

type PlatformTableProps = {
    rows: Piattaforma[];
    loading: boolean;
    onEdit: (piattaforma: Piattaforma) => void;
};

export function PlatformTable({ rows, loading, onEdit }: PlatformTableProps) {
    return (
        <table className="grid">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Canale</th>
                    <th>Objclass</th>
                    <th>In sola lettura</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                {loading && (
                    <tr>
                        <td colSpan={5}>Caricamento...</td>
                    </tr>
                )}
                {!loading &&
                    rows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.nome}</td>
                            <td>{row.canale}</td>
                            <td>{row.objClass}</td>
                            <td>{row.readOnly ? "Sì" : "No"}</td>
                            <td>
                                <button className="btn-secondary" onClick={() => onEdit(row)} type="button">
                                    Modifica
                                </button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
}
