import type { Gruppo, Piattaforma, Ruolo } from "../../types/types"

type RiepilogoStepProps = {
    piattaforma: Piattaforma;
    ruoli: Ruolo[];
    gruppi: Gruppo[];
    tipoAbilitazione: "TICKET" | "VERTICALE";
};

export function RiepilogoStep({ piattaforma, ruoli, gruppi, tipoAbilitazione }: RiepilogoStepProps) {
    return (
        <section className="card">
            <h3>Riepilogo finale</h3>
            <p>
                <strong>Piattaforma:</strong> {piattaforma.nome || "-"}
            </p>
            <p>
                <strong>Ruoli:</strong> {ruoli.length}
            </p>
            <p>
                <strong>Gruppi:</strong> {gruppi.length}
            </p>
            <p>
                <strong>Tipo abilitazione:</strong> {tipoAbilitazione}
            </p>
        </section>
    );
}
