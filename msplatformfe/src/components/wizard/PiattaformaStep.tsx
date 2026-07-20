import type { Piattaforma } from "../../types";

type PiattaformaStepProps = {
    piattaforma: Piattaforma;
    onChange: (piattaforma: Piattaforma) => void;
};

const TOGGLES: [string, keyof Piattaforma][] = [
    ["Richiedibile da cruscotto", "richiedibileDaCruscotto"],
    ["In sola lettura", "readOnly"],
    ["Richiedibile in corso", "richiedibileInCorso"],
    ["Ripetibile", "ripetibile"],
    ["Utilizzo modello autorizzativo", "utilizzoModelloAutorizzativo"]
];

export function PiattaformaStep({ piattaforma, onChange }: PiattaformaStepProps) {
    function updateField(field: keyof Piattaforma, value: string) {
        onChange({ ...piattaforma, [field]: value });
    }

    return (
        <section className="card">
            <h3>Dati base piattaforma</h3>
            <div className="form-grid">
                <input onChange={(e) => updateField("nome", e.target.value)} placeholder="Nome piattaforma" value={piattaforma.nome} />
                <input onChange={(e) => updateField("canale", e.target.value)} placeholder="Canale" value={piattaforma.canale} />
                <input onChange={(e) => updateField("descrizione", e.target.value)} placeholder="Descrizione" value={piattaforma.descrizione} />
                <input onChange={(e) => updateField("objClass", e.target.value)} placeholder="Objclass" value={piattaforma.objClass} />
                <input onChange={(e) => updateField("url", e.target.value)} placeholder="Url" value={piattaforma.url} />
                <input onChange={(e) => updateField("codiceIct", e.target.value)} placeholder="Codice ICT" value={piattaforma.codiceIct} />
                <input onChange={(e) => updateField("oamMetadataName", e.target.value)} placeholder="OAM Metadata Name" value={piattaforma.oamMetadataName} />
                <input onChange={(e) => updateField("oamMetadataValue", e.target.value)} placeholder="OAM Metadata Value" value={piattaforma.oamMetadataValue} />
            </div>
            <div className="toggles">
                {TOGGLES.map(([label, key]) => (
                    <label key={key}>
                        <input
                            checked={Boolean(piattaforma[key])}
                            onChange={(e) => onChange({ ...piattaforma, [key]: e.target.checked })}
                            type="checkbox"
                        />
                        {label}
                    </label>
                ))}
            </div>
        </section>
    );
}
