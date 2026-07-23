import { useState } from "react"
import type { CruscottoSezioneConfig, Gruppo } from "../../types/type"
import { Constants } from "../../utils/Constants"
import { CruscottoSezioneEditor } from "./CruscottoSezioneEditor"

type CruscottoSezioniManagerProps = {
    sezioni: CruscottoSezioneConfig[]
    gruppi: Gruppo[]
    esteso?: boolean
    onChange: (sezioni: CruscottoSezioneConfig[]) => void
}

function makeEmptySezione(): CruscottoSezioneConfig {
    return {
        header: "",
        subheader: "",
        gruppiIds: [],
        style: { layout: "list", bordered: true, dividers: true },
        fields: []
    }
}

export function CruscottoSezioniManager({ sezioni, gruppi, esteso = false, onChange }: CruscottoSezioniManagerProps) {
    const [expanded, setExpanded] = useState<number | null>(sezioni.length > 0 ? 0 : null)

    function updateSezione(i: number, s: CruscottoSezioneConfig) {
        onChange(sezioni.map((old, idx) => (idx === i ? s : old)))
    }
    function deleteSezione(i: number) {
        onChange(sezioni.filter((_, idx) => idx !== i))
        setExpanded(null)
    }
    function addSezione() {
        const next = [...sezioni, makeEmptySezione()]
        onChange(next)
        setExpanded(next.length - 1)
    }

    const n = sezioni.length

    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                {Constants.cruscotto.COMPONI_SEZIONE}
                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold normal-case text-primary-700">
                    {n} {n === 1 ? Constants.cruscotto.SEZIONE_SINGOLO : Constants.cruscotto.SEZIONE_PLURALE}
                </span>
            </div>

            <div className="mt-4 space-y-3">
                {sezioni.map((s, i) => (
                    <CruscottoSezioneEditor
                        key={i}
                        sezione={s}
                        index={i}
                        gruppi={gruppi}
                        esteso={esteso}
                        collapsed={expanded !== i}
                        onToggleCollapse={() => setExpanded(expanded === i ? null : i)}
                        onChange={(sez) => updateSezione(i, sez)}
                        onDelete={() => deleteSezione(i)}
                    />
                ))}
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={addSezione}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                    {Constants.cruscotto.AGGIUNGI_SEZIONE}
                </button>
            </div>
        </div>
    )
}
