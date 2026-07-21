const ICON_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50";

type IconActionsProps = {
    onEdit: () => void;
    onDelete: () => void;
};

// Pulsanti icona modifica/elimina riutilizzati nelle tabelle di dettaglio.
export function IconActions({ onEdit, onDelete }: IconActionsProps) {
    return (
        <div className="flex gap-2">
            <button type="button" aria-label="Modifica" onClick={onEdit} className={ICON_BTN}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </button>
            <button
                type="button"
                aria-label="Elimina"
                onClick={onDelete}
                className={`${ICON_BTN} hover:border-red-300 hover:text-red-600`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                </svg>
            </button>
        </div>
    );
}

// Indicatore obbligatorietà: spunta verde se true, divieto rosso se false.
export function RequiredMark({ value }: { value: boolean }) {
    if (value) {
        return (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-green-500 bg-green-500 text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
            </span>
        );
    }
    return (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14" />
            </svg>
        </span>
    );
}
