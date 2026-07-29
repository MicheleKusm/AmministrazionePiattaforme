import { useState } from "react"
import type { ComunicazioneOnboarding } from "../../types/type"
import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { IconaComunicazioneGlyph } from "../common/IconaComunicazione"
import { useGetIconeQuery } from "../../api/abilitazioniApi"
import { Constants } from "../../utils/Constants"

type ComunicazioneModalProps = {
    comunicazione: ComunicazioneOnboarding
    onSave: (comunicazione: ComunicazioneOnboarding) => void
    onClose: () => void
}

const LABEL_CLS = "mb-2 block text-sm font-semibold text-gray-800"
const INPUT_CLS = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"

export function ComunicazioneModal({ comunicazione, onSave, onClose }: ComunicazioneModalProps) {
    const [draft, setDraft] = useState<ComunicazioneOnboarding>({ ...comunicazione, typeIcona: comunicazione.typeIcona ?? "solid" })
    const [iconeOpen, setIconeOpen] = useState(false)

    const { data: icone = [] } = useGetIconeQuery()

    const valido = draft.testo.trim() !== "" && draft.icona.trim() !== ""

    const footer = (
        <>
            <Button
                variant="secondary"
                onClick={onClose}>
                {Constants.comunicazioneModal.ANNULLA}
            </Button>
            <Button
                onClick={() => onSave(draft)}
                disabled={!valido}>
                {Constants.comunicazioneModal.SALVA}
            </Button>
        </>
    )

    function selezionaIcona(nome: string) {
        setDraft({ ...draft, icona: nome })
        setIconeOpen(false)
    }

    return (
        <Modal
            title={Constants.comunicazioneModal.TITOLO}
            onClose={onClose}
            footer={footer}>
            <div className="space-y-4">
                <div>
                    <label className={LABEL_CLS}>
                        {Constants.comunicazioneModal.ICONA_LABEL} <span className="text-primary-600">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIconeOpen((o) => !o)}
                            className={`${INPUT_CLS} flex items-center justify-between gap-2`}>
                            {draft.icona ? (
                                <span className="flex items-center gap-2 text-gray-800">
                                    <IconaComunicazioneGlyph nome={draft.icona} tipo="outline" />
                                    {draft.icona}
                                </span>
                            ) : (
                                <span className="text-gray-400">{Constants.comunicazioneModal.ICONA}</span>
                            )}
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        {iconeOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-hidden
                                    tabIndex={-1}
                                    className="fixed inset-0 z-10 cursor-default"
                                    onClick={() => setIconeOpen(false)}
                                />
                                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                    {icone.map((nome) => {
                                        const attivo = draft.icona === nome
                                        return (
                                            <li key={nome}>
                                                <button
                                                    type="button"
                                                    onClick={() => selezionaIcona(nome)}
                                                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                                        attivo ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
                                                    }`}>
                                                    <IconaComunicazioneGlyph nome={nome} tipo="outline" />
                                                    {nome}
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <label className={LABEL_CLS}>{Constants.comunicazioneModal.TIPO_ICONA_LABEL}</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-800">
                            <input
                                type="checkbox"
                                checked={draft.typeIcona === "solid"}
                                onChange={() => setDraft({ ...draft, typeIcona: "solid" })}
                            />
                            {Constants.comunicazioneModal.TIPO_ICONA_SOLID}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-800">
                            <input
                                type="checkbox"
                                checked={draft.typeIcona === "outline"}
                                onChange={() => setDraft({ ...draft, typeIcona: "outline" })}
                            />
                            {Constants.comunicazioneModal.TIPO_ICONA_OUTLINE}
                        </label>
                    </div>
                </div>

                <div>
                    <label className={LABEL_CLS}>
                        {Constants.comunicazioneModal.DESCRIZIONE} <span className="text-primary-600">*</span>
                    </label>
                    <textarea
                        className={INPUT_CLS}
                        rows={3}
                        placeholder={Constants.comunicazioneModal.DESCRIZIONE_PH}
                        value={draft.testo}
                        onChange={(e) => setDraft({ ...draft, testo: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">{Constants.comunicazioneModal.HINT}</p>
                </div>
            </div>
        </Modal>
    )
}
