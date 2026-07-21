import { useEffect, useRef, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetGruppiAllQuery, useGetGruppiQuery, useSaveGruppoMutation } from "../api/gruppiApi"
import { useSavePiattaformaMutation } from "../api/piattaformeApi"
import { useGetRuoliQuery, useSaveRuoloMutation } from "../api/ruoliApi"
import { DeleteConfirmationModal } from "../components/modals/DeleteConfirmModal"
import { RoleModal } from "../components/modals/RoleModal"
import { AbilitazioneStep } from "../components/wizard/AbilitazioneStep"
import { CruscottoStep } from "../components/wizard/CruscottoStep"
import { GruppiStep } from "../components/wizard/GruppiStep"
import { PiattaformaStep } from "../components/wizard/PiattaformaStep"
import { RiepilogoStep } from "../components/wizard/RiepilogoStep"
import { RuoliStep } from "../components/wizard/RuoliStep"
import { Stepper } from "../components/wizard/Stepper"
import { type Gruppo, type Piattaforma, type Ruolo } from "../types/type"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { setRuoli, addRuolo, updateRuolo, removeRuolo } from "../store/ruoliSlice"
import { setGruppi, addGruppo, updateGruppo, removeGruppo } from "../store/gruppiSlice"

type PlatformWizardPageProps = {
    initialPiattaforma: Piattaforma;
    onDone: () => void;
    onCancel: () => void;
};

export function PlatformWizardPage({ initialPiattaforma, onDone, onCancel }: PlatformWizardPageProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [ruoloToDelete, setRuoloToDelete] = useState<Ruolo | null>(null)
    const initialLoadDone = useRef(false)
    const ruoliTempIdCounter = useRef(-1)
    const tempIdCounter = useRef(-1)
    const dispatch = useAppDispatch()
    const [step, setStep] = useState(2)
    const [piattaforma, setPiattaforma] = useState<Piattaforma>(initialPiattaforma)
    const [tipoAbilitazione] = useState<"TICKET" | "VERTICALE">("TICKET")

    const [roleDraft, setRoleDraft] = useState<Ruolo | null>(null)
    const [groupDraft, setGroupDraft] = useState<Gruppo | null>(null)

    const ruoli = useAppSelector((state) => state.ruoli.items)
    const gruppi = useAppSelector((state) => state.gruppi.items)

    const { data: ruoliData } = useGetRuoliQuery(piattaforma.id ?? skipToken)
    const { data: gruppiData } = useGetGruppiAllQuery()
    const [savePiattaforma] = useSavePiattaformaMutation()
    const [saveRuolo] = useSaveRuoloMutation()
    const [saveGruppo] = useSaveGruppoMutation()

    useEffect(() => {
        if (ruoliData && !initialLoadDone.current) {
            dispatch(setRuoli(ruoliData))
            initialLoadDone.current = true
        }
    }, [ruoliData, dispatch])

    useEffect(() => {
        if (gruppiData && !initialLoadDone.current) {
            dispatch(setGruppi(gruppiData))
            initialLoadDone.current = true
        }
    }, [gruppiData, dispatch])

    function prevStep() {
        setStep((s) => Math.max(2, s - 1))
    }

    function nextStep() {
        setStep((s) => Math.min(7, s + 1))
    }

    async function saveFinalConfiguration() {
        const savedPlatform = await savePiattaforma(piattaforma).unwrap()
        if (!savedPlatform.id) {
            return
        }
        for (const ruolo of ruoli) {
            await saveRuolo({ idPiattaforma: savedPlatform.id, ruolo }).unwrap()
        }
        for (const gruppo of gruppi) {
            await saveGruppo({ idPiattaforma: savedPlatform.id, gruppo }).unwrap()
        }
        onDone()
    }

    const handleAddRuolo = (ruolo: Ruolo) => dispatch(addRuolo(ruolo))
    const handleUpdateRuolo = (ruolo: Ruolo) => dispatch(updateRuolo(ruolo))
    const handleDeleteRuolo = (ruolo: Ruolo) => {
        setRuoloToDelete(ruolo)
        setDeleteModalOpen(true)
    }
    const confirmDeleteRuolo = () => {
        if (ruoloToDelete) {
            dispatch(removeRuolo(ruoloToDelete))
            setRuoloToDelete(null)
            setDeleteModalOpen(false)
        }
    }
    const handleAddGruppo = (gruppo: Gruppo) => dispatch(addGruppo(gruppo))
    const handleUpdateGruppo = (gruppo: Gruppo) => dispatch(updateGruppo(gruppo))
    const handleDeleteGruppo = (gruppo: Gruppo) => dispatch(removeGruppo(gruppo))

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
                    piattaformaId={piattaforma.id}
                    onAdd={() => {
                        const tempId = ruoliTempIdCounter.current--
                        setRoleDraft({
                            id: tempId,
                            nome: "",
                            descrizione: "",
                            richiedibileDaProcesso: false
                        })
                    }}
                    onDelete={handleDeleteRuolo}
                    onEdit={setRoleDraft}
                />
            )}
            {step === 4 && <AbilitazioneStep piattaforma={piattaforma} />}
            {step === 5 && (
                <GruppiStep
                    gruppi={gruppi}
                    onAdd={() =>
                        setGroupDraft({
                            nome: "",
                            descrizione: "",
                            ruoliIds: []
                        })
                    }
                    onDelete={handleDeleteGruppo}
                    onEdit={setGroupDraft}
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

            {
                roleDraft && (
                    <RoleModal
                        onClose={() => setRoleDraft(null)}
                        onSave={(role) => {
                            const exists = ruoli.some((r) => r.id === role.id)
                            if (exists) {
                                handleUpdateRuolo(role)
                            } else {
                                handleAddRuolo(role)
                            }
                            setRoleDraft(null)
                        }}
                        role={roleDraft}
                    />
                )
            }
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setRuoloToDelete(null)
                }}
                onConfirm={confirmDeleteRuolo}
                message="Sei sicuro di voler eliminare questo ruolo? L'operazione non è reversibile."
            />
        </>
    )
}

export { emptyPiattaforma } from "../types/type";
