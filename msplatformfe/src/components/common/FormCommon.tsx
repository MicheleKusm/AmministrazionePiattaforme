import { FormProps } from "../../types/type"

export function Form({
    onSubmit,
    onCancel,
    children,
    submitLabel = "Salva",
    cancelLabel = "Annulla",
    isSubmitting = false,
    className = ""
}: FormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className={className}>
            <div className="space-y-4">{children}</div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50">
                    {isSubmitting ? "Salvataggio..." : submitLabel}
                </button>
            </div>
        </form>
    )
}
