import type { ReactNode, SyntheticEvent } from "react"
import { Button } from "./Button"

type ModalCommonProps = {
    title: string
    onClose: () => void
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void
    children: ReactNode
    submitLabel?: string
    cancelLabel?: string
    isSubmitting?: boolean
}

export function ModalCommon({
    title,
    onClose,
    onSubmit,
    children,
    submitLabel = "Salva",
    cancelLabel = "Annulla",
    isSubmitting = false
}: ModalCommonProps) {
    return (
        <div className="modal-backdrop">
            <form
                className="modal"
                onSubmit={onSubmit}>
                <h4 className="text-lg font-bold">{title}</h4>
                <div className="space-y-3">{children}</div>
                <div className="actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        type="button"
                        disabled={isSubmitting}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}>
                        {isSubmitting ? "Salvataggio..." : submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    )
}
