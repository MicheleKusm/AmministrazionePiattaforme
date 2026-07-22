import type { PiattaformaStepProps } from "../../types/type"
import { PiattaformaForm } from "../forms/PiattaformaForm"

export function PiattaformaStep({ piattaforma, onChange, errors = {} }: PiattaformaStepProps) {
    return (
        <section className="card">
            <h3>Dati base piattaforma</h3>
            <PiattaformaForm
                piattaforma={piattaforma}
                onChange={onChange}
                errors={errors}
            />
        </section>
    )
}
