import { useEffect, useRef, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetGruppiAllQuery, useGetGruppoDependenciesQuery } from "../api/gruppiApi"
import { useValidatePiattaformaInitMutation } from "../api/piattaformeApi"
import { useGetRuoliQuery } from "../api/ruoliApi"
import { DeleteConfirmationModal } from "../components/modals/DeleteConfirmModal"
import { RoleModal } from "../components/modals/RoleModal"
import { GroupModal } from "../components/modals/GroupModal"
import { AbilitazioneStep } from "../components/wizard/AbilitazioneStep"
import { CruscottoStep } from "../components/wizard/CruscottoStep"
import { GruppiStep } from "../components/wizard/GruppiStep"
import { PiattaformaStep } from "../components/wizard/PiattaformaStep"
import { RiepilogoStep } from "../components/wizard/RiepilogoStep"
import { RuoliStep } from "../components/wizard/RuoliStep"
import { Stepper } from "../components/wizard/Stepper"
import { type Gruppo, type Piattaforma, PlatformWizardPageProps, type Ruolo } from "../types/type"
import { addPiattaforma, updatePiattaforma } from "../store/piattaformeSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
    addGruppo,
    addRuolo,
    removeGruppo,
    removeRuolo,
    resetRiepilogo,
    setGruppi,
    setPiattaforma as setRiepilogoPiattaforma,
    setRuoli,
    updateGruppo,
    updatePiattaforma as updateRiepilogoPiattaforma,
    updateRuolo
} from "../store/riepilogoSlice"
import { piattaformaSchema } from "../utils/schema"
import * as yup from "yup"

export function PlatformWizardPage({ initialPiattaforma, onDone, onCancel }: PlatformWizardPageProps) {
    const dispatch = useAppDispatch()

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [validatePiattaforma, { isLoading: isValidating }] = useValidatePiattaformaInitMutation()
    const [ruoloToDelete, setRuoloToDelete] = useState<Ruolo | null>(null)
    const [deleteGruppoModalOpen, setDeleteGruppoModalOpen] = useState(false)
    const [gruppoToDelete, setGruppoToDelete] = useState<Gruppo | null>(null)
    const [step, setStep] = useState(2)
    const [piattaformaErrors, setPiattaformaErrors] = useState<Record<string, string>>({})
    const [roleDraft, setRoleDraft] = useState<Ruolo | null>(null)
    const [groupDraft, setGroupDraft] = useState<Gruppo | null>(null)
    const [tipoAbilitazione] = useState<"TICKET" | "VERTICALE">("TICKET")
    const ruoliTempIdCounter = useRef(-1)
    const gruppiTempIdCounter = useRef(-1)
    const ruoliLoaded = useRef(false)
    const gruppiLoaded = useRef(false)

    const piattaforma = useAppSelector((state) => state.riepilogo.piattaforma)
    const ruoli = useAppSelector((state) => state.riepilogo.ruoli)
    const gruppi = useAppSelector((state) => state.riepilogo.gruppi)

    const { data: ruoliData } = useGetRuoliQuery(piattaforma?.id ?? skipToken)
    const { data: gruppiData } = useGetGruppiAllQuery()
    const { data: dependenciesData, isLoading: depsLoading } = useGetGruppoDependenciesQuery(gruppoToDelete?.id ?? skipToken)

    useEffect(() => {
        if (initialPiattaforma) {
            dispatch(setRiepilogoPiattaforma(initialPiattaforma))
        }
        setPiattaformaErrors({})
    }, [initialPiattaforma, dispatch])

    useEffect(() => {
        if (ruoliData && !ruoliLoaded.current) {
            dispatch(setRuoli(ruoliData))
            ruoliLoaded.current = true
        }
    }, [ruoliData, dispatch])

    useEffect(() => {
        if (gruppiData && !gruppiLoaded.current) {
            dispatch(setGruppi(gruppiData))
            gruppiLoaded.current = true
        }
    }, [gruppiData, dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetRiepilogo())
        }
    }, [dispatch])

    useEffect(() => {
        ruoliLoaded.current = false
        gruppiLoaded.current = false
    }, [piattaforma?.id])

    function prevStep() {
        setStep((s) => Math.max(2, s - 1))
    }

    function nextStep() {
        if (step === 2) {
            try {
                piattaformaSchema.validateSync(piattaforma!, {
                    abortEarly: false,
                    context: { currentId: piattaforma?.id }
                })
                validatePiattaforma(piattaforma!)
                    .unwrap()
                    .then((errors) => {
                        if (errors.length > 0) {
                            const errorMap: Record<string, string> = {}
                            errorMap._general = errors.join(", ")
                            setPiattaformaErrors(errorMap)
                        } else {
                            setPiattaformaErrors({})
                            setStep(3)
                        }
                    })
                    .catch((err) => {
                        console.error("Errore di validazione:", err)
                        setPiattaformaErrors({ _general: "Errore durante la validazione." })
                    })
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    const newErrors: Record<string, string> = {}
                    err.inner.forEach((e) => {
                        if (e.path) newErrors[e.path] = e.message
                    })
                    setPiattaformaErrors(newErrors)
                }
            }
            return
        }
        setStep((s) => Math.min(7, s + 1))
    }
    async function saveFinalConfiguration() {
        try {
            if (piattaforma?.id) {
                dispatch(updatePiattaforma(piattaforma))
            } else {
                const tempId = Math.floor(Math.random() * -1000) - 1
                const newPlatform = { ...piattaforma!, id: tempId }
                dispatch(addPiattaforma(newPlatform))
            }

            dispatch(resetRiepilogo())
            onDone()
        } catch (error) {
            console.error("Salvataggio fallito: ", error)
        }
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
    const handleDeleteGruppo = (gruppo: Gruppo) => {
        setGruppoToDelete(gruppo)
        setDeleteGruppoModalOpen(true)
    }
    const confirmDeleteGruppo = () => {
        if (gruppoToDelete) {
            dispatch(removeGruppo(gruppoToDelete))
            setGruppoToDelete(null)
            setDeleteGruppoModalOpen(false)
        }
    }

    const handlePiattaformaChange = (updated: Piattaforma) => {
        dispatch(updateRiepilogoPiattaforma(updated))
    }

    return (
        <>
            <Stepper currentStep={step} />

            {step === 2 && (
                <PiattaformaStep
                    piattaforma={piattaforma ?? initialPiattaforma}
                    onChange={handlePiattaformaChange}
                    errors={piattaformaErrors}
                />
            )}

            {step === 3 && (
                <RuoliStep
                    piattaformaId={piattaforma?.id}
                    ruoli={ruoli}
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

            {step === 4 && <AbilitazioneStep piattaforma={piattaforma ?? initialPiattaforma} />}

            {step === 5 && (
                <GruppiStep
                    gruppi={gruppi}
                    onAdd={() => {
                        const tempId = gruppiTempIdCounter.current--
                        setGroupDraft({
                            id: tempId,
                            nome: "",
                            descrizione: "",
                            ruoliIds: []
                        })
                    }}
                    onDelete={handleDeleteGruppo}
                    onEdit={setGroupDraft}
                />
            )}

            {step === 6 && <CruscottoStep />}

            {step === 7 && (
                <RiepilogoStep
                    gruppi={gruppi}
                    piattaforma={piattaforma ?? initialPiattaforma}
                    ruoli={ruoli}
                    tipoAbilitazione={tipoAbilitazione}
                />
            )}

            <div className="actions">
                <button
                    className="btn-secondary"
                    onClick={() => (step === 2 ? onCancel() : prevStep())}
                    disabled={isValidating}
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
            )}

            {groupDraft && (
                <GroupModal
                    group={groupDraft}
                    onClose={() => setGroupDraft(null)}
                    onSave={(group) => {
                        const exists = gruppi.some((g) => g.id === group.id)
                        if (exists) {
                            handleUpdateGruppo(group)
                        } else {
                            handleAddGruppo(group)
                        }
                        setGroupDraft(null)
                    }}
                    ruoli={ruoli}
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setRuoloToDelete(null)
                }}
                onConfirm={confirmDeleteRuolo}
                message="Sei sicuro di voler eliminare questo ruolo? L'operazione non è reversibile."
            />

            <DeleteConfirmationModal
                isOpen={deleteGruppoModalOpen}
                onClose={() => {
                    setDeleteGruppoModalOpen(false)
                    setGruppoToDelete(null)
                }}
                onConfirm={confirmDeleteGruppo}
                title="Elimina gruppo"
                message={
                    depsLoading
                        ? "Verifica dipendenze in corso..."
                        : dependenciesData?.dependencies?.length
                          ? `Attenzione, il gruppo è utilizzato da:\n${dependenciesData.dependencies.map((d) => `${d.type}: ${d.name}`).join("\n")}\nContinuare?`
                          : "Sei sicuro di voler eliminare questo gruppo? L'operazione non è reversibile."
                }
                confirmLabel={depsLoading ? "Attendi..." : "Elimina"}
                cancelLabel="Annulla"
            />
        </>
    )
}

export { emptyPiattaforma } from "../types/type"
