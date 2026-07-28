import { useState } from "react"
import type { CruscottoFieldConfig } from "../../types/type"
import { Constants } from "../../utils/Constants"
import { useGetTipologicheQuery } from "../../api/abilitazioniApi"

type CruscottoCampoEditorProps = {
    initial: CruscottoFieldConfig
    esteso?: boolean
    onSave: (campo: CruscottoFieldConfig) => void
    onCancel: () => void
}

const LABEL = "mb-1 block text-sm font-semibold text-gray-800"
const INPUT =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"

export function CruscottoCampoEditor({ initial, esteso = false, onSave, onCancel }: CruscottoCampoEditorProps) {
    const { data: tipologie = [] } = useGetTipologicheQuery()

    const [name, setName] = useState(initial.name)
    const [inputType, setInputType] = useState(initial.inputType)
    const [apiSource, setApiSource] = useState(initial.apiSource ?? "")
    const [order, setOrder] = useState<number>(initial.order || 1)
    const [label, setLabel] = useState(initial.label ?? "")
    const [labelRiepilogo, setLabelRiepilogo] = useState(initial.labelRiepilogo ?? "")
    const [description, setDescription] = useState(initial.description ?? "")
    const [figli, setFigli] = useState<CruscottoFieldConfig[]>(initial.children ?? [])
    const [figlioSel, setFiglioSel] = useState("")

    function selezionaTipologia(value: string) {
        setName(value)
        const t = tipologie.find((x) => x.tipoDati === value)
        if (t) {
            setInputType(t.type)
            setApiSource(t.apiSource ?? "")
        }
    }

    function aggiungiFiglio(value: string) {
        const t = tipologie.find((x) => x.tipoDati === value)
        if (!t) return
        setFigli((prev) => [...prev, { order: prev.length + 1, name: t.tipoDati ?? "", inputType: t.type, apiSource: t.apiSource ?? undefined }])
        setFiglioSel("")
    }

    function rimuoviFiglio(i: number) {
        setFigli((prev) => prev.filter((_, idx) => idx !== i))
    }

    function salva() {
        if (!name.trim()) return
        onSave({
            order: Number(order) || 1,
            name,
            inputType,
            label: esteso ? label.trim() || undefined : undefined,
            labelRiepilogo: esteso ? labelRiepilogo.trim() || undefined : undefined,
            description: esteso ? description.trim() || undefined : undefined,
            apiSource: apiSource.trim() || undefined,
            children: esteso && figli.length > 0 ? figli : undefined
        })
    }

    return (
        <div className="rounded-xl border-2 border-primary-300 bg-primary-50/40 p-5">
            <p className="text-sm font-bold text-primary-700">{Constants.cruscotto.CAMPO_TITOLO}</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                    <label className={LABEL}>
                        {Constants.cruscotto.CAMPO_TIPOLOGIA} <span className="text-primary-600">*</span>
                    </label>
                    <select
                        className={INPUT}
                        value={name}
                        onChange={(e) => selezionaTipologia(e.target.value)}>
                        <option value="">{Constants.cruscotto.CAMPO_TIPOLOGIA_PH}</option>
                        {tipologie.map((t) => (
                            <option
                                key={t.tipoDati}
                                value={t.tipoDati ?? ""}>
                                {t.tipoDati} ({t.type})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={LABEL}>
                        {Constants.cruscotto.CAMPO_ORDINE} <span className="text-primary-600">*</span>
                    </label>
                    <input
                        type="number"
                        min={1}
                        className={INPUT}
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                    />
                </div>

                {esteso && (
                    <>
                        <div>
                            <label className={LABEL}>{Constants.cruscotto.CAMPO_LABEL}</label>
                            <input
                                type="text"
                                className={INPUT}
                                placeholder={Constants.cruscotto.CAMPO_LABEL_PH}
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={LABEL}>{Constants.cruscotto.CAMPO_LABEL_RIEPILOGO}</label>
                            <input
                                type="text"
                                className={INPUT}
                                placeholder={Constants.cruscotto.CAMPO_LABEL_PH}
                                value={labelRiepilogo}
                                onChange={(e) => setLabelRiepilogo(e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>

            {esteso && (
                <div className="mt-4">
                    <label className={LABEL}>{Constants.cruscotto.CAMPO_DESCRIZIONE}</label>
                    <textarea
                        className={INPUT}
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            )}

            {esteso && (
                <div className="mt-4">
                    <label className={LABEL}>{Constants.cruscotto.CAMPO_CHILDREN}</label>
                    <select
                        className={INPUT}
                        value={figlioSel}
                        onChange={(e) => aggiungiFiglio(e.target.value)}>
                        <option value="">{Constants.cruscotto.CAMPO_CHILDREN_PH}</option>
                        {tipologie.map((t) => (
                            <option
                                key={t.tipoDati}
                                value={t.tipoDati ?? ""}>
                                {t.tipoDati} ({t.type})
                            </option>
                        ))}
                    </select>
                    {figli.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {figli.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                                    <span>
                                        <span className="font-semibold">{c.name}</span> <span className="text-gray-500">({c.inputType})</span>
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Rimuovi"
                                        onClick={() => rimuoviFiglio(i)}
                                        className="text-gray-400 hover:text-red-600">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2">
                                            <path d="M18 6 6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {Constants.cruscotto.CAMPO_ANNULLA}
                </button>
                <button
                    type="button"
                    onClick={salva}
                    disabled={!name.trim()}
                    className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
                    {Constants.cruscotto.CAMPO_SALVA}
                </button>
            </div>
        </div>
    )
}
