type SelectConLabelProps = {
    label: string
    value: string
    onChange: (value: string) => void
    options: string[]
    labelClassName?: string
    selectClassName?: string
    className?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
}

export function SelectConLabel({
    label,
    value,
    onChange,
    options,
    labelClassName = "mb-1 block text-sm font-semibold text-gray-800",
    selectClassName = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none",
    className = "",
    required = false,
    placeholder,
    disabled = false
}: SelectConLabelProps) {
    return (
        <div className={className}>
            <label className={labelClassName}>
                {label}
                {required && <span className="text-primary-600 ml-1">*</span>}
            </label>
            <select
                className={selectClassName}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}
