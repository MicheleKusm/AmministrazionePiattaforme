import { InfoTooltip } from "./InfoTooltip"

type CheckboxConInfoProps = {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    infoMessage: string
    disabled?: boolean
}

export function CheckboxConInfo({ label, checked, onChange, infoMessage, disabled = false }: CheckboxConInfoProps) {
    return (
        <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>{label}</span>
            <InfoTooltip message={infoMessage} />
        </label>
    )
}
