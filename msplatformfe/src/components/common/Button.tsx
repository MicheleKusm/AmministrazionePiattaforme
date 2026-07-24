import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "success" // 👈 added success

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    children: ReactNode
}

const variants: Record<Variant, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700" // 👈 new
}

export function Button({ variant = "primary", className = "", type = "button", children, ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`.trim()}
            {...props}>
            {children}
        </button>
    )
}
