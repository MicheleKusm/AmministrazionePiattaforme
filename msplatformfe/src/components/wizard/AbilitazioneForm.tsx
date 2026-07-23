import { useState } from "react";
import type { Abilitazione, CampoTicket, ComunicazioneOnboarding, Piattaforma, TipoAbilitazione, TipologicaCampoDinamico
} from "../../types/type";
import { emptyCampoTicket, emptyComunicazione } from "../../types/type";
import { Button } from "../common/Button";
import { CampiTicketTable } from "../tables/CampiTicketTable";
import { ComunicazioniTable } from "../tables/ComunicazioniTable";
import { CampoModal } from "../modals/CampoModal";
import { ComunicazioneModal } from "../modals/ComunicazioneModal";
import { Constants } from "../../utils/Constants";

type AbilitazioneFormProps = {
    piattaforma?: Piattaforma;
    initial: Abilitazione;
    tipoBloccato?: TipoAbilitazione;
    tipologiche: TipologicaCampoDinamico[];
    processi: string[];
    onCancel: () => void;
    onNew: () => void;
    onSave: (abilitazione: Abilitazione) => void;
};

const LABEL_CLS = "mb-1 block text-sm font-semibold text-gray-800";
const INPUT_CLS = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none";

function nextId(items: { id: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function titleCase(value: string): string {
    return value
        .toLowerCase()
        .split(" ")
        .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
        .join(" ");
}

type ChoiceCardProps = {
    titolo: string;
    descrizione: string;
    selezionato: boolean;
    onClick: () => void;
    icona: React.ReactNode;
    disabilitato?: boolean;
};

function ChoiceCard({ titolo, descrizione, selezionato, onClick, icona, disabilitato = false }: ChoiceCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabilitato}
            aria-disabled={disabilitato}
            title={disabilitato ? Constants.abilitazione.TIPO_BLOCCATO_TITLE : undefined}
            className={`relative flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-colors ${
                selezionato ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-white hover:bg-gray-50"
            } ${disabilitato ? "cursor-not-allowed opacity-50 hover:bg-white" : ""}`}>
            {selezionato && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {Constants.abilitazione.SELEZIONATO}
                </span>
            )}
            <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    selezionato ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-500"
                }`}>
                {icona}
            </span>
            <span className="text-lg font-bold text-gray-900">{titolo}</span>
            <span className="text-sm text-gray-500">{descrizione}</span>
        </button>
    );
}

const IconaVerticale = (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="M6 9v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M12 12v3" />
    </svg>
);

const IconaTicket = (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" />
    </svg>
);

export function AbilitazioneForm({ piattaforma, initial, tipoBloccato, tipologiche, processi, onCancel, onNew, onSave }: AbilitazioneFormProps) {
    const isNew = initial.id === 0;

    const [tipo, setTipo] = useState<TipoAbilitazione | "">(isNew ? (tipoBloccato ?? "") : initial.tipo);
    const [codiceScim, setCodiceScim] = useState(initial.codiceScim);
    const [processoVerticale, setProcessoVerticale] = useState(initial.processoVerticale);
    const [campi, setCampi] = useState<CampoTicket[]>(initial.campi);
    const [comunicazioni, setComunicazioni] = useState<ComunicazioneOnboarding[]>(initial.comunicazioni);

    const [campoDraft, setCampoDraft] = useState<CampoTicket | null>(null);
    const [comunicazioneDraft, setComunicazioneDraft] = useState<ComunicazioneOnboarding | null>(null);

    function selezionaTipo(nuovo: TipoAbilitazione) {
        if (nuovo === tipo) return;
        if (tipoBloccato && nuovo !== tipoBloccato) return;
        setTipo(nuovo);
        setCodiceScim("");
        setProcessoVerticale("");
        setCampi([]);
        setComunicazioni([]);
    }

    function salvaCampo(campo: CampoTicket) {
        setCampi((prev) => {
            const esiste = prev.some((c) => c.id === campo.id && campo.id !== 0);
            if (esiste) {
                return prev.map((c) => (c.id === campo.id ? campo : c));
            }
            return [...prev, { ...campo, id: nextId(prev) }];
        });
        setCampoDraft(null);
    }

    function salvaComunicazione(comunicazione: ComunicazioneOnboarding) {
        setComunicazioni((prev) => {
            const esiste = prev.some((c) => c.id === comunicazione.id && comunicazione.id !== 0);
            if (esiste) {
                return prev.map((c) => (c.id === comunicazione.id ? comunicazione : c));
            }
            return [...prev, { ...comunicazione, id: nextId(prev) }];
        });
        setComunicazioneDraft(null);
    }

    function salvaAbilitazione() {
        if (tipo === "") {
            return;
        }
        if (tipoBloccato && tipo !== tipoBloccato) {
            return;
        }
        const nome =
            tipo === "TICKET"
                ? `Abilitazione ticket ${piattaforma?.nome ?? ""}`.trim()
                : `Processo ${titleCase(processoVerticale)}`.trim();
        const riferimento = tipo === "TICKET" ? codiceScim : processoVerticale;
        const processKey = tipo === "TICKET" ? Constants.abilitazione.PROCESS_KEY_TICKET : processoVerticale;

        onSave({
            ...initial,
            nome,
            tipo,
            riferimento,
            stato: "Attiva",
            processKey,
            codiceScim: tipo === "TICKET" ? codiceScim : "",
            processoVerticale: tipo === "VERTICALE" ? processoVerticale : "",
            campi: tipo === "TICKET" ? campi : [],
            comunicazioni
        });
    }

    const salvabile = tipo === "TICKET" ? codiceScim.trim() !== "" : tipo === "VERTICALE" ? processoVerticale !== "" : false;

    return (
        <div className="mt-2 space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="secondary" onClick={onCancel}>
                    {Constants.abilitazione.TORNA_LISTA}
                </Button>
                <Button variant="secondary" onClick={onNew}>
                    {Constants.abilitazione.NUOVA}
                </Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">{Constants.abilitazione.TITOLO_AGGIUNGI}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{Constants.abilitazione.SOTTOTITOLO_AGGIUNGI}</p>
                {tipoBloccato && (
                    <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12" y1="16" y2="16" />
                        </svg>
                        <span>
                            {tipoBloccato === "TICKET"
                                ? Constants.abilitazione.TIPO_BLOCCATO_TICKET
                                : Constants.abilitazione.TIPO_BLOCCATO_VERTICALE}
                        </span>
                    </div>
                )}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <ChoiceCard
                        titolo={Constants.abilitazione.VERTICALE_TITOLO}
                        descrizione={Constants.abilitazione.VERTICALE_DESC}
                        selezionato={tipo === "VERTICALE"}
                        onClick={() => selezionaTipo("VERTICALE")}
                        disabilitato={tipoBloccato === "TICKET"}
                        icona={IconaVerticale}
                    />
                    <ChoiceCard
                        titolo={Constants.abilitazione.TICKET_TITOLO}
                        descrizione={Constants.abilitazione.TICKET_DESC}
                        selezionato={tipo === "TICKET"}
                        onClick={() => selezionaTipo("TICKET")}
                        disabilitato={tipoBloccato === "VERTICALE"}
                        icona={IconaTicket}
                    />
                </div>
            </div>

            {tipo === "VERTICALE" && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900">{Constants.abilitazione.DETTAGLI_VERTICALE}</h3>
                    <div className="mt-4">
                        <label className={LABEL_CLS}>
                            {Constants.abilitazione.SELEZIONA_PROCESSO} <span className="text-primary-600">*</span>
                        </label>
                        <select className={INPUT_CLS} value={processoVerticale} onChange={(e) => setProcessoVerticale(e.target.value)}>
                            <option value="">{Constants.abilitazione.SELEZIONA_PROCESSO_PH}</option>
                            {processi.map((processo) => (
                                <option key={processo} value={processo}>
                                    {processo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ComunicazioniSection
                        comunicazioni={comunicazioni}
                        onAdd={() => setComunicazioneDraft({ ...emptyComunicazione })}
                        onEdit={setComunicazioneDraft}
                        onDelete={(c) => setComunicazioni((prev) => prev.filter((x) => x.id !== c.id))}
                    />
                </div>
            )}

            {tipo === "TICKET" && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900">{Constants.abilitazione.DETTAGLI_TICKET}</h3>
                    <div className="mt-4">
                        <label className={LABEL_CLS}>{Constants.abilitazione.CODICE_SCIM}</label>
                        <input
                            className={INPUT_CLS}
                            placeholder={Constants.abilitazione.CODICE_SCIM_PH}
                            value={codiceScim}
                            onChange={(e) => setCodiceScim(e.target.value)}
                        />
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-gray-900">{Constants.abilitazione.CAMPI_TICKET}</h4>
                            <Button variant="secondary" onClick={() => setCampoDraft({ ...emptyCampoTicket })}>
                                {Constants.abilitazione.AGGIUNGI_CAMPO}
                            </Button>
                        </div>
                        <div className="mt-3">
                            <CampiTicketTable
                                campi={campi}
                                onEdit={setCampoDraft}
                                onDelete={(c) => setCampi((prev) => prev.filter((x) => x.id !== c.id))}
                            />
                        </div>
                    </div>

                    <ComunicazioniSection
                        comunicazioni={comunicazioni}
                        onAdd={() => setComunicazioneDraft({ ...emptyComunicazione })}
                        onEdit={setComunicazioneDraft}
                        onDelete={(c) => setComunicazioni((prev) => prev.filter((x) => x.id !== c.id))}
                    />
                </div>
            )}

            {tipo !== "" && (
                <div className="flex justify-between">
                    <Button variant="secondary" onClick={onCancel}>
                        {Constants.abilitazione.ANNULLA}
                    </Button>
                    <Button onClick={salvaAbilitazione} disabled={!salvabile}>
                        {Constants.abilitazione.SALVA}
                    </Button>
                </div>
            )}

            {campoDraft && (
                <CampoModal
                    campo={campoDraft}
                    tipologiche={tipologiche}
                    onSave={salvaCampo}
                    onClose={() => setCampoDraft(null)}
                />
            )}

            {comunicazioneDraft && (
                <ComunicazioneModal
                    comunicazione={comunicazioneDraft}
                    onSave={salvaComunicazione}
                    onClose={() => setComunicazioneDraft(null)}
                />
            )}
        </div>
    );
}

type ComunicazioniSectionProps = {
    comunicazioni: ComunicazioneOnboarding[];
    onAdd: () => void;
    onEdit: (comunicazione: ComunicazioneOnboarding) => void;
    onDelete: (comunicazione: ComunicazioneOnboarding) => void;
};

function ComunicazioniSection({ comunicazioni, onAdd, onEdit, onDelete }: ComunicazioniSectionProps) {
    return (
        <div className="mt-6">
            <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-gray-900">{Constants.abilitazione.COMUNICAZIONI}</h4>
                <Button variant="secondary" onClick={onAdd}>
                    {Constants.abilitazione.AGGIUNGI_COMUNICAZIONE}
                </Button>
            </div>
            <div className="mt-3">
                <ComunicazioniTable comunicazioni={comunicazioni} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
    );
}
