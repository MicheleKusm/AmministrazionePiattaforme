import { useState, useEffect } from "react"
import type { RoleModalProps, Ruolo } from "../../types/type"
import { ModalCommon } from "../common/ModalCommon"
import * as yup from "yup"
import { ruoloSchema } from "../../utils/schema"

export function RoleModal({ role, onSave, onClose }: RoleModalProps) {
    const [draft, setDraft] = useState<Ruolo>(role)
    const [errors, setErrors] = useState<{ nome?: string; descrizione?: string }>({})

    useEffect(() => {
        setDraft(role)
        setErrors({})
    }, [role])

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            ruoloSchema.validateSync(draft, { abortEarly: false })
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
            title="Aggiungi / Modifica ruolo"
            onClose={onClose}
            onSubmit={handleSubmit}>
            <div>
                <input
                    value={draft.nome}
                    onChange={(e) => {
                        setDraft({ ...draft, nome: e.target.value })
                        if (errors.nome) setErrors({ ...errors, nome: undefined })
                    }}
                    placeholder="Nome"
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

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={draft.richiedibileDaProcesso}
                    onChange={(e) => setDraft({ ...draft, richiedibileDaProcesso: e.target.checked })}
                />
                Richiedibile da processo
            </label>
        </ModalCommon>
    )
}
