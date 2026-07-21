import { useState } from "react";
import type { CanaleComunicazione, ComunicazioneOnboarding } from "../../types/type";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Constants } from "../../utils/Constants";

type ComunicazioneModalProps = {
    comunicazione: ComunicazioneOnboarding;
    onSave: (comunicazione: ComunicazioneOnboarding) => void;
    onClose: () => void;
};

const LABEL_CLS = "mb-2 block text-sm font-semibold text-gray-800";
const INPUT_CLS = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none";

function CanaleIcon({ canale }: { canale: CanaleComunicazione }) {
    const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
    switch (canale) {
        case "Email":
            return (
                <svg {...common}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </svg>
            );
        case "SMS":
            return (
                <svg {...common}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
                </svg>
            );
        case "In-app":
            return (
                <svg {...common}>
                    <rect x="7" y="2" width="10" height="20" rx="2" />
                    <path d="M11 18h2" />
                </svg>
            );
        case "Push":
            return (
                <svg {...common}>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
            );
        case "Webhook":
            return (
                <svg {...common}>
                    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 1 1 4 12.9" />
                    <path d="M12 6a4 4 0 0 1 4 4c0 1.1-.5 2-1 2.9" />
                    <path d="M9.5 9.5 12 6" />
                </svg>
            );
        case "WhatsApp":
            return (
                <svg {...common}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
            );
    }
}

export function ComunicazioneModal({ comunicazione, onSave, onClose }: ComunicazioneModalProps) {
    const [draft, setDraft] = useState<ComunicazioneOnboarding>(comunicazione);

    const valido = draft.descrizione.trim() !== "";

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose}>
                {Constants.comunicazioneModal.ANNULLA}
            </Button>
            <Button onClick={() => onSave(draft)} disabled={!valido}>
                {Constants.comunicazioneModal.SALVA}
            </Button>
        </>
    );

    return (
        <Modal title={Constants.comunicazioneModal.TITOLO} onClose={onClose} footer={footer}>
            <div className="space-y-4">
                <div>
                    <label className={LABEL_CLS}>
                        {Constants.comunicazioneModal.ICONA} <span className="text-primary-600">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {Constants.canali.map((canale) => {
                            const attivo = draft.canale === canale;
                            return (
                                <button
                                    key={canale}
                                    type="button"
                                    onClick={() => setDraft({ ...draft, canale })}
                                    className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs font-medium transition-colors ${
                                        attivo
                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                    }`}>
                                    <CanaleIcon canale={canale} />
                                    {canale}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className={LABEL_CLS}>
                        {Constants.comunicazioneModal.DESCRIZIONE} <span className="text-primary-600">*</span>
                    </label>
                    <textarea
                        className={INPUT_CLS}
                        rows={3}
                        placeholder={Constants.comunicazioneModal.DESCRIZIONE_PH}
                        value={draft.descrizione}
                        onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">{Constants.comunicazioneModal.HINT}</p>
                </div>
            </div>
        </Modal>
    );
}
