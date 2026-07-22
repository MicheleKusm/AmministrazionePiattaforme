import { FormFieldProps } from "../../types/type"

export function FormField({ children, error, className = "" }: FormFieldProps) {
    return (
        <div className={className}>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}
