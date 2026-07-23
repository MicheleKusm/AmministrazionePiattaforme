import type { Gruppo, Piattaforma, RiepilogoStepProps, Ruolo } from "../../types/type"
import { RiepilogoTable } from "../../components/tables/RiepilogoTable"

export function RiepilogoStep({ piattaforma, ruoli, gruppi, tipoAbilitazione }: RiepilogoStepProps) {
    return (
        <div>
            <RiepilogoTable/>
        </div>
    );
}
