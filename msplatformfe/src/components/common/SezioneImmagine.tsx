type SezioneImmagineProps = {
    title: string
    imageSrc: string
    imageAlt?: string
    className?: string
}

export function SezioneImmagine({ title, imageSrc, imageAlt = "", className = "" }: SezioneImmagineProps) {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
            <div className="px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            </div>
            <div className="px-6 pb-6">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full rounded-lg border border-gray-200"
                />
            </div>
        </div>
    )
}
