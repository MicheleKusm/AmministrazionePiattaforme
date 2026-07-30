import { useEffect, useMemo, useRef, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import type { CruscottoStepConfig, CruscottoStepKey, Piattaforma } from "../../types/type"
import { makeDefaultCruscotto } from "../../types/type"
import { useGetCruscottoQuery } from "../../api/cruscottoApi"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setCruscotto, updateCruscottoStep } from "../../store/riepilogoSlice"
import { Constants } from "../../utils/Constants"
import { CruscottoSezione } from "../cruscotto/CruscottoSezione"
import { CruscottoSezioniManager } from "../cruscotto/CruscottoSezioniManager"
import { CruscottoPreviewModal } from "../modals/CruscottoPreviewModal"
import { Button } from "../common/Button"

type CruscottoStepProps = {
    piattaforma?: Piattaforma
}

const STEP_KEYS: CruscottoStepKey[] = ["STEP_RUOLO", "STEP_DATI", "STEP_METADATI"]

function mergeConfigs(data: CruscottoStepConfig[] | undefined): CruscottoStepConfig[] {
    const defaults = makeDefaultCruscotto()
    if (!data || data.length === 0) return defaults
    return defaults.map((def) => data.find((d) => d.chiave === def.chiave) ?? { ...def, abilitato: false })
}

export function CruscottoStep({ piattaforma }: CruscottoStepProps) {
    const dispatch = useAppDispatch()
    const [active, setActive] = useState<CruscottoStepKey>("STEP_RUOLO")
    const [previewOpen, setPreviewOpen] = useState(false)
    const cruscottoLoaded = useRef(false)

    const cruscotto = useAppSelector((state) => state.riepilogo.cruscotto)
    const allGruppi = useAppSelector((state) => state.gruppi.items)
    const editedGruppi = useAppSelector((state) => state.riepilogo.gruppi)
    const gruppi = useMemo(() => {
        const all = [...allGruppi]
        for (const t of editedGruppi) {
            const idx = all.findIndex((g) => g.id === t.id)
            if (idx >= 0) all[idx] = t
            else all.push(t)
        }
        return all
    }, [allGruppi, editedGruppi])

    const { data: cruscottoData } = useGetCruscottoQuery(piattaforma?.id ?? skipToken)

    useEffect(() => {
        if (cruscottoLoaded.current || cruscotto.length > 0) return
        if (!piattaforma?.richiedibileDaCruscotto) return
        if (!piattaforma?.id) {
            dispatch(setCruscotto(makeDefaultCruscotto()))
            cruscottoLoaded.current = true
        } else if (cruscottoData) {
            dispatch(setCruscotto(mergeConfigs(cruscottoData)))
            cruscottoLoaded.current = true
        }
    }, [piattaforma?.id, piattaforma?.richiedibileDaCruscotto, cruscottoData, cruscotto.length, dispatch])

    if (!piattaforma?.richiedibileDaCruscotto) {
        return (
            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">{Constants.cruscotto.TITOLO}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{Constants.cruscotto.SOTTOTITOLO}</p>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-5 text-amber-800">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                        />
                        <line
                            x1="12"
                            x2="12"
                            y1="8"
                            y2="12"
                        />
                        <line
                            x1="12"
                            x2="12"
                            y1="16"
                            y2="16"
                        />
                    </svg>
                    <div>
                        <p className="font-semibold">{Constants.cruscotto.NON_ABILITATA_TITOLO}</p>
                        <p className="mt-1 text-sm">{Constants.cruscotto.NON_ABILITATA_MSG}</p>
                    </div>
                </div>
            </div>
        )
    }

    const activeConfig = cruscotto.find((c) => c.chiave === active)

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{Constants.cruscotto.TITOLO}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{Constants.cruscotto.SOTTOTITOLO}</p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setPreviewOpen(true)}>
                    Genera anteprima
                </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                {STEP_KEYS.map((key) => {
                    const cfg = cruscotto.find((c) => c.chiave === key)
                    const isActive = active === key
                    const stato = cfg?.abilitato ? Constants.cruscotto.ATTIVO : Constants.cruscotto.NON_ATTIVO
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActive(key)}
                            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                                isActive ? "bg-primary-600 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}>
                            {key} ({stato})
                        </button>
                    )
                })}
            </div>

            {activeConfig && (active === "STEP_RUOLO" || active === "STEP_DATI" || active === "STEP_METADATI") ? (
                <>
                    <CruscottoSezione
                        config={activeConfig}
                        gruppi={gruppi}
                        onChange={(c) => dispatch(updateCruscottoStep(c))}
                    />
                    {(active === "STEP_DATI" || active === "STEP_METADATI") && activeConfig.abilitato && (
                        <CruscottoSezioniManager
                            sezioni={activeConfig.sezioni}
                            gruppi={gruppi.filter((g) => g.id != null && activeConfig.gruppiIds.includes(g.id))}
                            esteso={active === "STEP_DATI" || active === "STEP_METADATI"}
                            onChange={(sezioni) => dispatch(updateCruscottoStep({ ...activeConfig, sezioni }))}
                        />
                    )}
                </>
            ) : (
                <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                    {Constants.cruscotto.STEP_NON_DISPONIBILE}
                </div>
            )}
            {previewOpen && (
                <CruscottoPreviewModal
                    cruscotto={cruscotto}
                    gruppi={gruppi}
                    onClose={() => setPreviewOpen(false)}
                />
            )}
        </div>
    )
}
