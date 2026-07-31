type RadioOption = {
    value: string
    label: string
}

type RadioCommonProps = {
    name: string
    options: RadioOption[]
    value: string
    onChange: (value: string) => void
    label?: string
    className?: string
    labelClassName?: string
    radioClassName?: string
    disabled?: boolean
}

export function RadioCommon({
    name,
    options,
    value,
    onChange,
    label,
    className = "",
    labelClassName = "mb-2 block text-sm font-semibold text-gray-800",
    radioClassName = "flex items-center gap-6",
    disabled = false
}: RadioCommonProps) {
    return (
        <div className={className}>
            {label && <label className={labelClassName}>{label}</label>}
            <div className={radioClassName}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            disabled={disabled}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    )
}
