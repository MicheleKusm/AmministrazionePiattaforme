import { useState } from "react"
import type { CruscottoStepConfig, CruscottoSezioneConfig, CruscottoFieldConfig, Gruppo } from "../../types/type"
import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { Card } from "../common/Card"
import { PageHeader } from "../common/PageHeader"
import { Badge } from "../common/Badge"

type CruscottoPreviewModalProps = {
    cruscotto: CruscottoStepConfig[]
    gruppi: Gruppo[]
    onClose: () => void
}

const DEFAULT_STYLE = { layout: "list", bordered: true, dividers: true }

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

export function CruscottoPreviewModal({ cruscotto, gruppi, onClose }: CruscottoPreviewModalProps) {
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
    const [pageIndex, setPageIndex] = useState(0)

    const idsUsati = new Set<number>()
    cruscotto.forEach((step) => step.gruppiIds.forEach((id) => idsUsati.add(id)))
    const gruppiCards = gruppi.filter((g) => !g.daEliminare && idsUsati.has(g.id))

    const sezioniGruppo: CruscottoSezioneConfig[] =
        selectedGroup == null
            ? []
            : cruscotto
                  .filter((s) => s.chiave === "STEP_DATI" || s.chiave === "STEP_METADATI")
                  .reduce<CruscottoSezioneConfig[]>((acc, s) => acc.concat(s.sezioni), [])
                  .filter((sez) => sez.gruppiIds.includes(selectedGroup))

    const sezione = sezioniGruppo[pageIndex]
    const style = sezione?.style ?? DEFAULT_STYLE
    const isGrid = style.layout === "grid"
    const fields = sezione ? sezione.fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : []

    const footer =
        selectedGroup == null ? (
            <div className="flex w-full items-center justify-between">
                <span className="text-xs text-gray-400">{gruppiCards.length} gruppi disponibili</span>
                <Button variant="secondary" onClick={onClose}>
                    Chiudi
                </Button>
            </div>
        ) : (
            <div className="flex w-full items-center justify-between">
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (pageIndex > 0) setPageIndex(pageIndex - 1)
                        else setSelectedGroup(null)
                    }}>
                    {pageIndex > 0 ? "Indietro" : "Cambia gruppo"}
                </Button>
                {sezioniGruppo.length > 0 && (
                    <Button onClick={() => setPageIndex(Math.min(sezioniGruppo.length - 1, pageIndex + 1))} disabled={pageIndex >= sezioniGruppo.length - 1}>
                        Prosegui
                    </Button>
                )}
            </div>
        )

    return (
        <Modal title="Anteprima cruscotto" onClose={onClose} modalClassName="!w-[90vw] !max-w-7xl" footer={footer}>
            {selectedGroup == null ? (
                <div>
                    <PageHeader title="Seleziona la tipologia di utente" subtitle="Indica il tipo di utente da abilitare." />
                    <div className="space-y-4">
                        {gruppiCards.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                                Nessun gruppo associato agli step del cruscotto.
                            </p>
                        ) : (
                            gruppiCards.map((g) => (
                                <Card key={g.id} className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900">{g.nome}</h3>
                                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{g.descrizione}</p>
                                    <div className="mt-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setSelectedGroup(g.id)
                                                setPageIndex(0)
                                            }}>
                                            Prosegui →
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            ) : sezioniGruppo.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                    Nessuna sezione configurata per questo gruppo (in STEP_DATI / STEP_METADATI).
                </p>
            ) : (
                <div className="flex gap-6">
                    <div className="w-56 shrink-0 space-y-1">
                        {sezioniGruppo.map((sez, i) => (
                            <button
                                key={i}
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
                                <span className="truncate">{sez.header || `Sezione ${i + 1}`}</span>
                            </button>
                        ))}
                    </div>

                    <div className="min-w-0 flex-1">
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
                    </div>
                </div>
            )}
        </Modal>
    )
}
