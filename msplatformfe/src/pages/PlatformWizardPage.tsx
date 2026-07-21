import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetGruppiQuery, useSaveGruppoMutation } from "../api/gruppiApi";
import { useSavePiattaformaMutation } from "../api/piattaformeApi";
import { useGetRuoliQuery, useSaveRuoloMutation } from "../api/ruoliApi";
import { GroupModal } from "../components/modals/GroupModal";
import { RoleModal } from "../components/modals/RoleModal";
import { AbilitazioneStep } from "../components/wizard/AbilitazioneStep";
import { CruscottoStep } from "../components/wizard/CruscottoStep";
import { GruppiStep } from "../components/wizard/GruppiStep";
import { PiattaformaStep } from "../components/wizard/PiattaformaStep";
import { RiepilogoStep } from "../components/wizard/RiepilogoStep";
import { RuoliStep } from "../components/wizard/RuoliStep";
import { Stepper } from "../components/wizard/Stepper";
import { type Gruppo, type Piattaforma, type Ruolo } from "../types/type";

type PlatformWizardPageProps = {
    initialPiattaforma: Piattaforma;
    onDone: () => void;
    onCancel: () => void;
};

export function PlatformWizardPage({ initialPiattaforma, onDone, onCancel }: PlatformWizardPageProps) {
    const [step, setStep] = useState(2);
    const [piattaforma, setPiattaforma] = useState<Piattaforma>(initialPiattaforma);
    const [ruoli, setRuoli] = useState<Ruolo[]>([]);
    const [gruppi, setGruppi] = useState<Gruppo[]>([]);
    const [tipoAbilitazione, setTipoAbilitazione] = useState<"TICKET" | "VERTICALE">("TICKET");
    const [processoVerticale, setProcessoVerticale] = useState("");

    const [roleDraft, setRoleDraft] = useState<Ruolo | null>(null);
    const [groupDraft, setGroupDraft] = useState<Gruppo | null>(null);

    const { data: ruoliData } = useGetRuoliQuery(piattaforma.id ?? skipToken);
    const { data: gruppiData } = useGetGruppiQuery(piattaforma.id ?? skipToken);
    const [savePiattaforma] = useSavePiattaformaMutation();
    const [saveRuolo] = useSaveRuoloMutation();
    const [saveGruppo] = useSaveGruppoMutation();

    useEffect(() => {
        if (ruoliData) {
            setRuoli(ruoliData);
        }
    }, [ruoliData]);

    useEffect(() => {
        if (gruppiData) {
            setGruppi(gruppiData);
        }
    }, [gruppiData]);

    function prevStep() {
        setStep((s) => Math.max(2, s - 1));
    }

    function nextStep() {
        setStep((s) => Math.min(7, s + 1));
    }

    async function saveFinalConfiguration() {
        const savedPlatform = await savePiattaforma(piattaforma).unwrap();
        if (!savedPlatform.id) {
            return;
        }
        for (const ruolo of ruoli) {
            await saveRuolo({ idPiattaforma: savedPlatform.id, ruolo }).unwrap();
        }
        for (const gruppo of gruppi) {
            await saveGruppo({ idPiattaforma: savedPlatform.id, gruppo }).unwrap();
        }
        onDone();
    }

    return (
        <>
            <Stepper currentStep={step} />

            {step === 2 && (
                <PiattaformaStep
                    onChange={setPiattaforma}
                    piattaforma={piattaforma}
                />
            )}

            {step === 3 && (
                <RuoliStep
                    onAdd={() => setRoleDraft({ id: 0, nome: "", descrizione: "", richiedibileDaProcesso: false })}
                    onDelete={(r) => setRuoli(ruoli.filter((x) => x !== r))}
                    onEdit={setRoleDraft}
                />
            )}

            {step === 4 && (
                <GruppiStep
                    gruppi={gruppi}
                    onAdd={() => setGroupDraft({ nome: "", descrizione: "", ruoliIds: [] })}
                    onDelete={(g) => setGruppi(gruppi.filter((x) => x !== g))}
                    onEdit={setGroupDraft}
                />
            )}

            {step === 5 && (
                <AbilitazioneStep
                    onChangeProcesso={setProcessoVerticale}
                    onChangeTipo={setTipoAbilitazione}
                    processoVerticale={processoVerticale}
                    tipoAbilitazione={tipoAbilitazione}
                />
            )}

            {step === 6 && <CruscottoStep />}

            {step === 7 && (
                <RiepilogoStep
                    gruppi={gruppi}
                    piattaforma={piattaforma}
                    ruoli={ruoli}
                    tipoAbilitazione={tipoAbilitazione}
                />
            )}

            <div className="actions">
                <button
                    className="btn-secondary"
                    onClick={() => (step === 2 ? onCancel() : prevStep())}
                    type="button">
                    Indietro
                </button>
                {step < 7 ? (
                    <button
                        className="btn-primary"
                        onClick={nextStep}
                        type="button">
                        Avanti
                    </button>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={() => void saveFinalConfiguration()}
                        type="button">
                        Salva configurazione
                    </button>
                )}
            </div>

            {roleDraft && (
                <RoleModal
                    onClose={() => setRoleDraft(null)}
                    onSave={(role) => {
                        setRuoli((prev) => {
                            const found = prev.find((x) => x === roleDraft || (x.id && x.id === roleDraft.id))
                            return found ? prev.map((x) => (x === found ? role : x)) : [...prev, role]
                        })
                        setRoleDraft(null)
                    }}
                    role={roleDraft}
                />
            )}

            {groupDraft && (
                <GroupModal
                    group={groupDraft}
                    onClose={() => setGroupDraft(null)}
                    onSave={(group) => {
                        setGruppi((prev) => {
                            const found = prev.find((x) => x === groupDraft || (x.id && x.id === groupDraft.id))
                            return found ? prev.map((x) => (x === found ? group : x)) : [...prev, group]
                        })
                        setGroupDraft(null)
                    }}
                    ruoli={ruoli}
                />
            )}
        </>
    )
}

export { emptyPiattaforma } from "../types/type";
