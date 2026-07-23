import { useEffect, useRef, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import type { CruscottoStepConfig, CruscottoStepKey, Piattaforma } from "../../types/type"
import { makeDefaultCruscotto } from "../../types/type"
import { useGetCruscottoQuery } from "../../api/cruscottoApi"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setCruscotto, updateCruscottoStep } from "../../store/riepilogoSlice"
import { Constants } from "../../utils/Constants"
import { CruscottoSezione } from "./CruscottoSezione"

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
    const cruscottoLoaded = useRef(false)

    const cruscotto = useAppSelector((state) => state.riepilogo.cruscotto)
    const gruppi = useAppSelector((state) => state.riepilogo.gruppi)

    const { data: cruscottoData } = useGetCruscottoQuery(piattaforma?.id ?? skipToken)

    useEffect(() => {
        if (cruscottoLoaded.current || cruscotto.length > 0) return
        if (!piattaforma?.id) {
            dispatch(setCruscotto(makeDefaultCruscotto()))
            cruscottoLoaded.current = true
        } else if (cruscottoData) {
            dispatch(setCruscotto(mergeConfigs(cruscottoData)))
            cruscottoLoaded.current = true
        }
    }, [piattaforma?.id, cruscottoData, cruscotto.length, dispatch])

    const activeConfig = cruscotto.find((c) => c.chiave === active)

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">{Constants.cruscotto.TITOLO}</h3>
            <p className="mt-0.5 text-sm text-gray-500">{Constants.cruscotto.SOTTOTITOLO}</p>

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
                                isActive
                                    ? "bg-primary-600 text-white"
                                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}>
                            {key} ({stato})
                        </button>
                    )
                })}
            </div>

            {active === "STEP_RUOLO" && activeConfig ? (
                <CruscottoSezione
                    config={activeConfig}
                    gruppi={gruppi}
                    onChange={(c) => dispatch(updateCruscottoStep(c))}
                />
            ) : (
                <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                    {Constants.cruscotto.STEP_NON_DISPONIBILE}
                </div>
            )}
        </div>
    )
}
