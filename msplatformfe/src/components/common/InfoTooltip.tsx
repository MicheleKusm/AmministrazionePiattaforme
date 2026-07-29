import { useState } from "react"

type InfoTooltipProps = {
    message: string
    className?: string
}

export function InfoTooltip({ message, className = "" }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            className={`relative inline-flex items-center ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 hover:text-gray-600 cursor-help transition-colors">
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                />
                <line
                    x1="12"
                    x2="12"
                    y1="12"
                    y2="16"
                />
                <line
                    x1="12"
                    x2="12"
                    y1="8"
                    y2="8"
                />
            </svg>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 max-w-sm p-3 bg-white text-gray-800 text-xs rounded-lg shadow-lg border border-gray-200 pointer-events-none whitespace-normal">
                    {message}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45" />
                </div>
            )}
        </div>
    )
}
