import { useState } from "react";
import type { CampoTicket, TipologicaCampoDinamico } from "../../types/type";
import { Modal } from "../common/Modal";
import { Toggle } from "../common/Toggle";
import { Button } from "../common/Button";
import { Constants } from "../../utils/Constants";

type CampoModalProps = {
    campo: CampoTicket;
    tipologiche: TipologicaCampoDinamico[];
    onSave: (campo: CampoTicket) => void;
    onClose: () => void;
};

const LABEL_CLS = "mb-1 block text-sm font-semibold text-gray-800";
const INPUT_CLS = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none";

export function CampoModal({ campo, tipologiche, onSave, onClose }: CampoModalProps) {
    const [draft, setDraft] = useState<CampoTicket>(campo);

    const selezionato = draft.campo !== "";

    function selezionaCampo(tipoDati: string) {
        const tip = tipologiche.find((t) => t.tipoDati === tipoDati);
        if (!tip) {
            setDraft({ ...draft, campo: "", tipoValore: "", regex: "" });
            return;
        }
        setDraft({
            ...draft,
            campo: tip.tipoDati,
            tipoValore: tip.type,
            regex: tip.regex ?? ""
        });
    }

    const valido = selezionato && draft.label.trim() !== "";

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose}>
                {Constants.campoModal.ANNULLA}
            </Button>
            <Button onClick={() => onSave(draft)} disabled={!valido}>
                {Constants.campoModal.SALVA}
            </Button>
        </>
    );

    return (
        <Modal title={Constants.campoModal.TITOLO} onClose={onClose} footer={footer}>
            <div className="space-y-4">
                <div>
                    <label className={LABEL_CLS}>
                        {Constants.campoModal.CAMPO} <span className="text-primary-600">*</span>
                    </label>
                    <select
                        className={INPUT_CLS}
                        value={draft.campo}
                        onChange={(e) => selezionaCampo(e.target.value)}>
                        <option value="">{Constants.campoModal.CAMPO_PH}</option>
                        {tipologiche.map((t) => (
                            <option key={t.idTipoDati} value={t.tipoDati}>
                                {t.tipoDati}
                            </option>
                        ))}
                    </select>
                </div>

                {!selezionato && <p className="text-sm text-gray-500">{Constants.campoModal.HINT}</p>}

                {selezionato && (
                    <>
                        <div>
                            <label className={LABEL_CLS}>
                                {Constants.campoModal.LABEL} <span className="text-primary-600">*</span>
                            </label>
                            <input
                                className={INPUT_CLS}
                                placeholder={Constants.campoModal.LABEL_PH}
                                value={draft.label}
                                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={LABEL_CLS}>{Constants.campoModal.DESCRIZIONE}</label>
                            <textarea
                                className={INPUT_CLS}
                                rows={3}
                                placeholder={Constants.campoModal.DESCRIZIONE_PH}
                                value={draft.descrizione}
                                onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className={`${LABEL_CLS} mb-0`}>{Constants.campoModal.OBBLIGATORIO}</label>
                            <Toggle
                                checked={draft.obbligatoria}
                                onChange={(v) => setDraft({ ...draft, obbligatoria: v })}
                            />
                        </div>

                        <div>
                            <label className={LABEL_CLS}>{Constants.campoModal.TIPO_VALORE}</label>
                            <select className={`${INPUT_CLS} bg-gray-100 text-gray-600`} value={draft.tipoValore} disabled>
                                <option value={draft.tipoValore}>{draft.tipoValore}</option>
                            </select>
                        </div>

                        <div>
                            <label className={LABEL_CLS}>
                                {Constants.campoModal.REGEX}{" "}
                                <span className="font-normal text-gray-400">{Constants.campoModal.REGEX_OPZIONALE}</span>
                            </label>
                            <input
                                className={INPUT_CLS}
                                placeholder={Constants.campoModal.REGEX_PH}
                                value={draft.regex}
                                onChange={(e) => setDraft({ ...draft, regex: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={LABEL_CLS}>
                                {Constants.campoModal.CSS_CLASS}{" "}
                                <span className="font-normal text-gray-400">{Constants.campoModal.REGEX_OPZIONALE}</span>
                            </label>
                            <input
                                className={INPUT_CLS}
                                placeholder={Constants.campoModal.CSS_CLASS_PH}
                                value={draft.cssClass ?? ""}
                                onChange={(e) => setDraft({ ...draft, cssClass: e.target.value })}
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
