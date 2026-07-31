import { useState } from "react"
import type { CruscottoStepConfig, CruscottoSezioneConfig, CruscottoFieldConfig, Gruppo } from "../../types/type"
import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { Card } from "../common/Card"
import { PageHeader } from "../common/PageHeader"
import { Badge } from "../common/Badge"
import { SelectConLabel } from "../common/SelectConLabel"

type CruscottoPreviewModalProps = {
    cruscotto: CruscottoStepConfig[]
    gruppi: Gruppo[]
    onClose: () => void
}

const DEFAULT_STYLE = { layout: "list", bordered: true, dividers: true }

const PAGES = [
    { key: "STEP_DATI", label: "Dati" },
    { key: "STEP_RUOLO", label: "Ruolo" },
    { key: "STEP_METADATI", label: "Metadati" },
    { key: "RIEPILOGO", label: "Riepilogo" }
] as const

function sortFields(fields: CruscottoFieldConfig[]): CruscottoFieldConfig[] {
    return fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function FieldBox({ field, bordered }: { field: CruscottoFieldConfig; bordered: boolean }) {
    return (
        <div className={`rounded-md bg-gray-50 p-3 ${bordered ? "border border-gray-400" : "border border-dashed border-gray-200"}`}>
            <div className="flex items-center justify-between gap-2">
                <span className="break-all font-mono text-xs font-semibold text-gray-800">{field.name || "(senza nome)"}</span>
                <Badge tone="blue">{field.inputType || "—"}</Badge>
            </div>
            {field.children && field.children.length > 0 && (
                <div className="mt-2 space-y-2 border-l-2 border-gray-300 pl-3">
                    {field.children.map((c, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 rounded border border-dashed border-gray-300 bg-white p-2">
                            <span className="break-all font-mono text-xs text-gray-700">{c.name || "(senza nome)"}</span>
                            <Badge tone="gray">{c.inputType || "—"}</Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function SezioneView({ sezione }: { sezione: CruscottoSezioneConfig }) {
    const style = sezione.style ?? DEFAULT_STYLE
    const isGrid = style.layout === "grid"
    const fields = sortFields(sezione.fields)
    return (
        <Card className="p-6">
            <PageHeader title={sezione.header || "(senza titolo)"} subtitle={sezione.subheader || undefined} />
            {fields.length === 0 ? (
                <p className="text-sm text-gray-400">Nessun campo in questa sezione.</p>
            ) : isGrid ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {fields.map((f, i) => (
                        <FieldBox key={i} field={f} bordered={style.bordered} />
                    ))}
                </div>
            ) : (
                <div className={style.dividers ? "divide-y divide-gray-200" : "space-y-3"}>
                    {fields.map((f, i) => (
                        <div key={i} className={style.dividers ? "py-3 first:pt-0 last:pb-0" : ""}>
                            <FieldBox field={f} bordered={style.bordered} />
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}

function StepSezioniView({ step, titolo }: { step?: CruscottoStepConfig; titolo: string }) {
    const sezioni = step?.sezioni ?? []
    return (
        <div>
            <PageHeader title={titolo} subtitle={step?.descrizione || undefined} />
            {sezioni.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                    Nessuna sezione configurata per questo step.
                </p>
            ) : (
                <div className="space-y-6">
                    {sezioni.map((sez, i) => (
                        <SezioneView key={i} sezione={sez} />
                    ))}
                </div>
            )}
        </div>
    )
}

function RuoloView({ step, gruppi }: { step?: CruscottoStepConfig; gruppi: Gruppo[] }) {
    const [selected, setSelected] = useState("")
    const ids = step?.gruppiIds ?? []
    const options = gruppi.filter((g) => !g.daEliminare && ids.includes(g.id)).map((g) => g.nome)
    return (
        <div>
            <PageHeader title="Ruolo" subtitle={step?.descrizione || "Seleziona la tipologia di utente da abilitare."} />
            <Card className="p-6">
                <SelectConLabel
                    label="Tipologia utente"
                    value={selected}
                    onChange={setSelected}
                    options={options}
                    placeholder="Seleziona un'opzione"
                />
            </Card>
        </div>
    )
}

function RiepilogoStepBlock({ titolo, step }: { titolo: string; step?: CruscottoStepConfig }) {
    const sezioni = step?.sezioni ?? []
    return (
        <div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{titolo}</h3>
            {sezioni.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-4 text-center text-sm text-gray-500">Nessun dato.</p>
            ) : (
                <div className="space-y-4">
                    {sezioni.map((sez, i) => (
                        <Card key={i} className="p-5">
                            <h4 className="text-base font-semibold text-gray-800">{sez.header || "(senza titolo)"}</h4>
                            {sez.subheader && <p className="mb-3 text-sm text-gray-500">{sez.subheader}</p>}
                            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                                {sortFields(sez.fields).map((f, j) => (
                                    <div key={j} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="break-words text-sm font-semibold text-gray-800">{f.labelRiepilogo || f.label || f.name}</span>
                                            <Badge tone="gray">{f.inputType || "—"}</Badge>
                                        </div>
                                        {f.description && <p className="mt-1 text-xs text-gray-500">{f.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function RiepilogoView({
    stepRuolo,
    stepDati,
    stepMetadati,
    gruppi
}: {
    stepRuolo?: CruscottoStepConfig
    stepDati?: CruscottoStepConfig
    stepMetadati?: CruscottoStepConfig
    gruppi: Gruppo[]
}) {
    const idsRuolo = stepRuolo?.gruppiIds ?? []
    const gruppiRuolo = gruppi.filter((g) => !g.daEliminare && idsRuolo.includes(g.id))
    return (
        <div className="space-y-6">
            <PageHeader title="Riepilogo" subtitle="Riepilogo di tutti gli step configurati." />
            <div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Ruolo</h3>
                <Card className="p-5">
                    {gruppiRuolo.length === 0 ? (
                        <p className="text-sm text-gray-500">Nessun ruolo selezionato.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {gruppiRuolo.map((g) => (
                                <Badge key={g.id} tone="blue">
                                    {g.nome}
                                </Badge>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
            <RiepilogoStepBlock titolo="Dati" step={stepDati} />
            <RiepilogoStepBlock titolo="Metadati" step={stepMetadati} />
        </div>
    )
}

export function CruscottoPreviewModal({ cruscotto, gruppi, onClose }: CruscottoPreviewModalProps) {
    const [pageIndex, setPageIndex] = useState(0)

    const stepRuolo = cruscotto.find((s) => s.chiave === "STEP_RUOLO")
    const stepDati = cruscotto.find((s) => s.chiave === "STEP_DATI")
    const stepMetadati = cruscotto.find((s) => s.chiave === "STEP_METADATI")

    const currentKey = PAGES[pageIndex].key

    const footer = (
        <div className="flex w-full items-center justify-between">
            <Button variant="secondary" onClick={() => setPageIndex(Math.max(0, pageIndex - 1))} disabled={pageIndex === 0}>
                Indietro
            </Button>
            {pageIndex < PAGES.length - 1 ? (
                <Button onClick={() => setPageIndex(Math.min(PAGES.length - 1, pageIndex + 1))}>Prosegui</Button>
            ) : (
                <Button variant="secondary" onClick={onClose}>
                    Chiudi
                </Button>
            )}
        </div>
    )

    return (
        <Modal title="Anteprima cruscotto" onClose={onClose} modalClassName="!w-[90vw] !max-w-7xl" footer={footer}>
            <div className="flex gap-6">
                <div className="w-56 shrink-0 space-y-1">
                    {PAGES.map((p, i) => (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => setPageIndex(i)}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                                i === pageIndex ? "bg-primary-50 font-semibold text-primary-700" : "text-gray-600 hover:bg-gray-100"
                            }`}>
                            <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    i === pageIndex ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}>
                                {i + 1}
                            </span>
                            <span className="truncate">{p.label}</span>
                        </button>
                    ))}
                </div>

                <div className="min-w-0 flex-1">
                    {currentKey === "STEP_RUOLO" && <RuoloView step={stepRuolo} gruppi={gruppi} />}
                    {currentKey === "STEP_DATI" && <StepSezioniView step={stepDati} titolo="Dati" />}
                    {currentKey === "STEP_METADATI" && <StepSezioniView step={stepMetadati} titolo="Metadati" />}
                    {currentKey === "RIEPILOGO" && (
                        <RiepilogoView stepRuolo={stepRuolo} stepDati={stepDati} stepMetadati={stepMetadati} gruppi={gruppi} />
                    )}
                </div>
            </div>
        </Modal>
    )
}
