type IconaDinamicaProps = {
    svg?: string | null
    className?: string
}

export function IconaDinamica({ svg, className }: { svg?: string | null; className?: string }) {
    // dati arrivano già controllati da BE, ma possibile introdurre DOMPurify of simil per sicurezza extra
    if (!svg) return null
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    )
}
