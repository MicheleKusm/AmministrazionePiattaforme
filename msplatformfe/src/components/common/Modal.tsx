import type { ReactNode } from "react";

type ModalProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
};

export function Modal({ title, onClose, children, footer }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h4 className="text-lg font-bold text-gray-900">{title}</h4>
                    <button
                        type="button"
                        aria-label="Chiudi"
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto px-6 py-4">{children}</div>
                {footer && <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">{footer}</div>}
            </div>
        </div>
    );
}
