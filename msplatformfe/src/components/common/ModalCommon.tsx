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
    modalClassName?: string
}

export function ModalCommon({
    title,
    onClose,
    onSubmit,
    children,
    submitLabel = "Salva",
    cancelLabel = "Annulla",
    isSubmitting = false,
    modalClassName = ""
}: ModalCommonProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form
                className={`bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 ${modalClassName}`.trim()}
                onSubmit={onSubmit}>
                <h4 className="text-lg font-bold mb-4">{title}</h4>
                <div className="space-y-3">{children}</div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
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
