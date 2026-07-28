type ToggleProps = {
    checked: boolean
    onChange: (value: boolean) => void
    disabled?: boolean
}

export function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-11 items-center rounded-full p-0 m-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                checked ? "bg-primary-600" : "bg-gray-300"
            }`}>
            <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`}
            />
        </button>
    )
}
