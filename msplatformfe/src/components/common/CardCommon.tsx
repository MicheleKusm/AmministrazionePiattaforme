import type { ReactNode } from "react"

type CardCommonProps = {
    title: string
    children: ReactNode
    className?: string
}

export function CardCommon({ title, children, className = "" }: CardCommonProps) {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white shadow-sm p-4 m-1 hover:bg-gray-50 transition-colors ${className}`}>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{title}</h4>
            <div className="space-y-2">{children}</div>
        </div>
    )
}
