import { useState } from "react"
import type { CruscottoFieldConfig, CruscottoSezioneConfig, Gruppo } from "../../types/type"
import { Constants } from "../../utils/Constants"
import { CruscottoCampoEditor } from "./CruscottoCampoEditor"

type CruscottoSezioneEditorProps = {
    sezione: CruscottoSezioneConfig
    index: number
    gruppi: Gruppo[]
    esteso?: boolean
    collapsed: boolean
    onToggleCollapse: () => void
    onChange: (sezione: CruscottoSezioneConfig) => void
    onDelete: () => void
}

const LABEL = "mb-1 block text-sm font-semibold text-gray-800"
const INPUT =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
const ICON_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"

function makeEmptyField(nextOrder: number): CruscottoFieldConfig {
    return { order: nextOrder, name: "", inputType: "" }
}

export function CruscottoSezioneEditor({
    sezione,
    index,
    gruppi,
    esteso = false,
    collapsed,
    onToggleCollapse,
    onChange,
    onDelete
}: CruscottoSezioneEditorProps) {
    const [campoDraft, setCampoDraft] = useState<CruscottoFieldConfig | null>(null)
    const [campoDraftIdx, setCampoDraftIdx] = useState<number | null>(null)

    const gruppiVisibili = gruppi.filter((g) => !g.daEliminare && g.id != null)
    const titolo = sezione.header.trim() || Constants.cruscotto.NUOVA_SEZIONE_TITOLO

    function set(patch: Partial<CruscottoSezioneConfig>) {
        onChange({ ...sezione, ...patch })
    }
    function setStyle(patch: Partial<CruscottoSezioneConfig["style"]>) {
        onChange({ ...sezione, style: { ...sezione.style, ...patch } })
    }
    function toggleGruppo(id: number) {
        const has = sezione.gruppiIds.includes(id)
        set({ gruppiIds: has ? sezione.gruppiIds.filter((g) => g !== id) : [...sezione.gruppiIds, id] })
    }
    function nextOrder() {
        return sezione.fields.reduce((m, f) => Math.max(m, f.order), 0) + 1
    }
    function salvaCampo(campo: CruscottoFieldConfig) {
        // altri campi (escludo quello in modifica), ordinati per posizione attuale
        const altri = sezione.fields.filter((_, idx) => idx !== campoDraftIdx).sort((a, b) => a.order - b.order)
        const pos = Math.min(Math.max(Number(campo.order) || 1, 1), altri.length + 1)
        altri.splice(pos - 1, 0, campo)
        const fields = altri.map((f, idx) => ({ ...f, order: idx + 1 }))
        set({ fields })
        setCampoDraft(null)
        setCampoDraftIdx(null)
    }
    function eliminaCampo(i: number) {
        set({ fields: sezione.fields.filter((_, idx) => idx !== i) })
    }

    const nCampi = sezione.fields.length
    const nGruppi = sezione.gruppiIds.length

    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {index + 1}
                    </span>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{titolo}</p>
                        <div className="mt-1 flex gap-2">
                            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                                {nCampi} {nCampi === 1 ? Constants.cruscotto.CAMPO_LABEL_SINGOLO : Constants.cruscotto.CAMPO_LABEL_PLURALE}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                {nGruppi > 0 ? `${nGruppi} ${Constants.cruscotto.GRUPPI_LABEL}` : Constants.cruscotto.NESSUN_GRUPPO}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        aria-label="Elimina"
                        onClick={onDelete}
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
                    <button
                        type="button"
                        aria-label="Espandi"
                        onClick={onToggleCollapse}
                        className={ICON_BTN}>
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            {collapsed ? <path d="m6 9 6 6 6-6" /> : <path d="m18 15-6-6-6 6" />}
                        </svg>
                    </button>
                </div>
            </div>

            {!collapsed && (
                <div className="border-t border-gray-200 px-5 py-5">
                    <p className="text-sm font-semibold text-gray-900">{Constants.cruscotto.SEZIONE_GRUPPI_TITOLO}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{Constants.cruscotto.SEZIONE_GRUPPI_HINT}</p>
                    {gruppiVisibili.length === 0 ? (
                        <p className="mt-1 text-sm text-gray-400">{Constants.cruscotto.SEZIONE_GRUPPI_VUOTI}</p>
                    ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {gruppiVisibili.map((g) => {
                                const sel = sezione.gruppiIds.includes(g.id as number)
                                return (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => toggleGruppo(g.id as number)}
                                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                                            sel
                                                ? "border-primary-600 bg-primary-50 text-primary-700"
                                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}>
                                        {g.nome}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={LABEL}>{Constants.cruscotto.SEZIONE_HEADER_LABEL}</label>
                            <input
                                type="text"
                                className={INPUT}
                                placeholder={Constants.cruscotto.SEZIONE_HEADER_PH}
                                value={sezione.header}
                                onChange={(e) => set({ header: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={LABEL}>{Constants.cruscotto.SEZIONE_SUBHEADER_LABEL}</label>
                            <input
                                type="text"
                                className={INPUT}
                                placeholder={Constants.cruscotto.SEZIONE_SUBHEADER_PH}
                                value={sezione.subheader}
                                onChange={(e) => set({ subheader: e.target.value })}
                            />
                        </div>
                    </div>

                    {esteso && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2 md:items-center">
                            <div>
                                <label className={LABEL}>{Constants.cruscotto.SEZIONE_LAYOUT_LABEL}</label>
                                <select
                                    className={INPUT}
                                    value={sezione.style.layout}
                                    onChange={(e) => setStyle({ layout: e.target.value })}>
                                    {Constants.cruscotto.LAYOUT_OPTIONS.map((o) => (
                                        <option
                                            key={o.value}
                                            value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-6 md:mt-6">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={sezione.style.bordered}
                                        onChange={(e) => setStyle({ bordered: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600"
                                    />
                                    {Constants.cruscotto.SEZIONE_BORDO}
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={sezione.style.dividers}
                                        onChange={(e) => setStyle({ dividers: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600"
                                    />
                                    {Constants.cruscotto.SEZIONE_DIVISORI}
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                            {Constants.cruscotto.SEZIONE_CAMPI_TITOLO} ({nCampi}):
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setCampoDraftIdx(null)
                                setCampoDraft(makeEmptyField(nextOrder()))
                            }}
                            className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                            {Constants.cruscotto.AGGIUNGI_CAMPO}
                        </button>
                    </div>

                    {campoDraft && (
                        <div className="mt-3">
                            <CruscottoCampoEditor
                                initial={campoDraft}
                                esteso={esteso}
                                onSave={salvaCampo}
                                onCancel={() => {
                                    setCampoDraft(null)
                                    setCampoDraftIdx(null)
                                }}
                            />
                        </div>
                    )}

                    <div className="mt-3 space-y-2">
                        {nCampi === 0 && !campoDraft ? (
                            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
                                {Constants.cruscotto.CAMPI_VUOTI}
                            </div>
                        ) : (
                            sezione.fields.map((f, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold">{f.name}</span> <span className="text-gray-500">({f.inputType})</span>
                                        <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                                            Ordine: {f.order}
                                        </span>
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            aria-label="Modifica"
                                            onClick={() => {
                                                setCampoDraftIdx(i)
                                                setCampoDraft(f)
                                            }}
                                            className={ICON_BTN}>
                                            <svg
                                                width="14"
                                                height="14"
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
                                            onClick={() => eliminaCampo(i)}
                                            className={`${ICON_BTN} hover:border-red-300 hover:text-red-600`}>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2">
                                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
