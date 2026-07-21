import { useState } from "react"
import type { GroupModalProps, Gruppo } from "../../types/type"
import { ModalCommon } from "../common/ModalCommon"
import * as yup from "yup"
import { gruppoSchema } from "../../utils/schema"

export function GroupModal({ group, ruoli, onSave, onClose }: GroupModalProps) {
    const [draft, setDraft] = useState<Gruppo>(group)
    const [errors, setErrors] = useState<{ nome?: string; descrizione?: string }>({})

    const toggleRuolo = (idRuolo?: number) => {
        if (!idRuolo) return
        const next = draft.ruoliIds.includes(idRuolo) ? draft.ruoliIds.filter((id) => id !== idRuolo) : [...draft.ruoliIds, idRuolo]
        setDraft({ ...draft, ruoliIds: next })
    }

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            gruppoSchema.validateSync(draft, { abortEarly: false })
            onSave(draft)
        } catch (err) {
            const newErrors: { nome?: string; descrizione?: string } = {}
            if (err instanceof yup.ValidationError) {
                err.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path as keyof typeof newErrors] = error.message
                    }
                })
            }
            setErrors(newErrors)
        }
    }

    return (
        <ModalCommon
            title="Aggiungi / Modifica gruppo"
            onClose={onClose}
            onSubmit={handleSubmit}>
            <div>
                <input
                    value={draft.nome}
                    onChange={(e) => {
                        setDraft({ ...draft, nome: e.target.value })
                        if (errors.nome) setErrors({ ...errors, nome: undefined })
                    }}
                    placeholder="Nome gruppo"
                    required
                    className={`w-full rounded border px-3 py-2 text-sm ${errors.nome ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
            </div>

            <div>
                <textarea
                    value={draft.descrizione}
                    onChange={(e) => {
                        setDraft({ ...draft, descrizione: e.target.value })
                        if (errors.descrizione) setErrors({ ...errors, descrizione: undefined })
                    }}
                    placeholder="Descrizione"
                    required
                    className={`w-full rounded border px-3 py-2 text-sm ${errors.descrizione ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.descrizione && <p className="mt-1 text-xs text-red-500">{errors.descrizione}</p>}
            </div>

            <div className="space-y-1">
                {ruoli.map((ruolo) => (
                    <label
                        key={ruolo.id ?? ruolo.nome}
                        className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={Boolean(ruolo.id && draft.ruoliIds.includes(ruolo.id))}
                            onChange={() => toggleRuolo(ruolo.id)}
                        />
                        {ruolo.nome}
                    </label>
                ))}
            </div>
        </ModalCommon>
    )
}
