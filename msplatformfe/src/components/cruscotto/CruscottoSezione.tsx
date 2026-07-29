import { useState } from "react"
import type { CruscottoStepConfig, Gruppo } from "../../types/type"
import { Toggle } from "../common/Toggle"
import { Constants } from "../../utils/Constants"
import { DeleteConfirmationModal } from "../modals/DeleteConfirmModal"

type CruscottoSezioneProps = {
    config: CruscottoStepConfig
    gruppi: Gruppo[]
    onChange: (config: CruscottoStepConfig) => void
}

const INPUT =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"

export function CruscottoSezione({ config, gruppi, onChange }: CruscottoSezioneProps) {
    const gruppiVisibili = gruppi.filter((g) => !g.daEliminare && g.id != null)
    const [confermaOpen, setConfermaOpen] = useState(false)

    const haDati = config.descrizione.trim() !== "" || config.gruppiIds.length > 0 || config.sezioni.length > 0

    function handleToggle(v: boolean) {
        if (v) {
            onChange({ ...config, abilitato: true })
            return
        }
        if (haDati) {
            setConfermaOpen(true)
        } else {
            onChange({ ...config, abilitato: false })
        }
    }

    function confermaDisabilita() {
        onChange({ ...config, abilitato: false, descrizione: "", gruppiIds: [], sezioni: [] })
        setConfermaOpen(false)
    }

    function toggleGruppo(id: number) {
        const selected = config.gruppiIds.includes(id)
        const gruppiIds = selected ? config.gruppiIds.filter((g) => g !== id) : [...config.gruppiIds, id]
        onChange({ ...config, gruppiIds })
    }

    return (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                {Constants.cruscotto.CONFIGURA_SEZIONE}
            </div>

            <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-gray-900">{Constants.cruscotto.ABILITA_STEP}</p>
                </div>
                <Toggle checked={config.abilitato} onChange={handleToggle} />
            </div>

            <div className="mt-5">
                <label className="mb-1 block text-sm font-semibold text-gray-900">{Constants.cruscotto.DESCRIZIONE}</label>
                <input
                    type="text"
                    value={config.descrizione}
                    placeholder={Constants.cruscotto.DESCRIZIONE_SEZIONE}
                    onChange={(e) => onChange({ ...config, descrizione: e.target.value })}
                    disabled={!config.abilitato}
                    className={`${INPUT} disabled:cursor-not-allowed disabled:bg-gray-100`}
                />
            </div>

            <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900">{Constants.cruscotto.GRUPPI_TITOLO}</p>
                {gruppiVisibili.length === 0 ? (
                    <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-4 text-center text-sm text-gray-500">
                        {Constants.cruscotto.GRUPPI_VUOTI}
                    </div>
                ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {gruppiVisibili.map((g) => {
                            const selected = config.gruppiIds.includes(g.id as number)
                            return (
                                <button
                                    key={g.id}
                                    type="button"
                                    onClick={() => toggleGruppo(g.id as number)}
                                    disabled={!config.abilitato}
                                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        selected
                                            ? "border-primary-600 bg-primary-50 text-primary-700"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}>
                                    {g.nome}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={confermaOpen}
                onClose={() => setConfermaOpen(false)}
                onConfirm={confermaDisabilita}
                title="Disabilita step"
                message={"Disabilitando questo step i dati che hai compilato verranno cancellati.\nVuoi procedere?"}
                confirmLabel="Disabilita e cancella"
                cancelLabel="Annulla"
            />
        </div>
    )
}
