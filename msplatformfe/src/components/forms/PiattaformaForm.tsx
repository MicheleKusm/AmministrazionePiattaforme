import type { Piattaforma } from "../../types/type"
import { FormField } from "../common/FormField"

type PiattaformaFormProps = {
    piattaforma: Piattaforma
    onChange: (piattaforma: Piattaforma) => void
    errors?: Record<string, string>
}

const TOGGLES: [string, keyof Piattaforma][] = [
    ["Richiedibile da cruscotto", "richiedibileDaCruscotto"],
    ["In sola lettura", "readOnly"],
    ["Richiedibile in corso", "richiedibileInCorso"],
    ["Ripetibile", "ripetibile"],
    ["Utilizzo modello autorizzativo", "utilizzoModelloAutorizzativo"]
]

export function PiattaformaForm({ piattaforma, onChange, errors = {} }: PiattaformaFormProps) {
    const updateField = (field: keyof Piattaforma, value: string) => {
        onChange({ ...piattaforma, [field]: value })
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField error={errors.nome}>
                    <h4>Nome Piattaforma</h4>
                    <input
                        value={piattaforma.nome}
                        onChange={(e) => updateField("nome", e.target.value)}
                        placeholder="Nome piattaforma"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.nome ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.canale}>
                    <h4>Canale</h4>
                    <input
                        value={piattaforma.canale}
                        onChange={(e) => updateField("canale", e.target.value)}
                        placeholder="Canale"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.canale ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.descrizione}>
                    <h4>Descrizione</h4>
                    <input
                        value={piattaforma.descrizione}
                        onChange={(e) => updateField("descrizione", e.target.value)}
                        placeholder="Descrizione"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.descrizione ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.objClass}>
                    <h4>Obj Class</h4>
                    <input
                        value={piattaforma.objClass}
                        onChange={(e) => updateField("objClass", e.target.value)}
                        placeholder="Objclass"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.objClass ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.url}>
                    <h4>URL</h4>
                    <input
                        value={piattaforma.url}
                        onChange={(e) => updateField("url", e.target.value)}
                        placeholder="Url"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.url ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.codiceIct}>
                    <h4>Codice Ict</h4>
                    <input
                        value={piattaforma.codiceIct}
                        onChange={(e) => updateField("codiceIct", e.target.value)}
                        placeholder="Codice ICT"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.codiceIct ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.oamMetadataName}>
                    <h4>OAM Metadata Name</h4>
                    <input
                        value={piattaforma.oamMetadataName}
                        onChange={(e) => updateField("oamMetadataName", e.target.value)}
                        placeholder="OAM Metadata Name"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.oamMetadataName ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>

                <FormField error={errors.oamMetadataValue}>
                    <h4>OAM Metadata Value</h4>
                    <input
                        value={piattaforma.oamMetadataValue}
                        onChange={(e) => updateField("oamMetadataValue", e.target.value)}
                        placeholder="OAM Metadata Value"
                        className={`w-full rounded border px-3 py-2 text-sm ${errors.oamMetadataValue ? "border-red-500" : "border-gray-300"}`}
                    />
                </FormField>
            </div>

            <div className="space-y-2">
                {TOGGLES.map(([label, key]) => (
                    <label
                        key={key}
                        className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={Boolean(piattaforma[key])}
                            onChange={(e) => onChange({ ...piattaforma, [key]: e.target.checked })}
                        />
                        {label}
                    </label>
                ))}
            </div>
        </div>
    )
}
