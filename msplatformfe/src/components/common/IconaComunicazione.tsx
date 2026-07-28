import type { ReactNode } from "react";
import type { TipoIcona } from "../../types/type";

const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2
} as const;

const GLYPHS: Record<string, ReactNode> = {
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </>
    ),
    business_center: (
        <>
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </>
    ),
    description: (
        <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
        </>
    ),
    files: (
        <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h8" />
        </>
    ),
    summarize: (
        <>
            <path d="M8 6h11" />
            <path d="M8 12h11" />
            <path d="M8 18h11" />
            <path d="M3 6h.01" />
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
        </>
    )
};

export function IconaComunicazioneGlyph({ nome, tipo = "outline" }: { nome: string; tipo?: TipoIcona }) {
    const glyph = GLYPHS[nome] ?? <rect x="4" y="4" width="16" height="16" rx="2" />;
    const paint = tipo === "Solid" ? { fill: "currentColor", stroke: "none", strokeWidth: 0 } : {};
    return <svg {...common} {...paint}>{glyph}</svg>;
}
