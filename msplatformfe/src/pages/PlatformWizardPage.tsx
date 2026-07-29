import { useEffect, useRef, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetGruppiAllQuery, useGetGruppoDependenciesQuery } from "../api/gruppiApi"
import { useValidatePiattaformaInitMutation } from "../api/piattaformeApi"
import { useGetRuoliQuery } from "../api/ruoliApi"
import { usePersistMutation } from "../api/persistenceApi"
import { DeleteConfirmationModal } from "../components/modals/DeleteConfirmModal"
import { RoleModal } from "../components/modals/RoleModal"
import { GroupModal } from "../components/modals/GroupModal"
import { ResultModal } from "../components/modals/ResultModal"
import { AbilitazioneStep } from "../components/wizard/AbilitazioneStep"
import { CruscottoStep } from "../components/wizard/CruscottoStep"
import { GruppiStep } from "../components/wizard/GruppiStep"
import { PiattaformaStep } from "../components/wizard/PiattaformaStep"
import { RiepilogoStep } from "../components/wizard/RiepilogoStep"
import { RuoliStep } from "../components/wizard/RuoliStep"
import { Stepper } from "../components/wizard/Stepper"
import { type Gruppo, PersistenceObject, type Piattaforma, PlatformWizardPageProps, type Ruolo } from "../types/type"
import { setGruppi as setMainGruppi } from "../store/gruppiSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { useExport } from "../hooks/useExport"
import {
    resetRiepilogo,
    setCruscotto,
    setPiattaforma as setRiepilogoPiattaforma,
    setRuoli,
    updatePiattaforma as updateRiepilogoPiattaforma
} from "../store/riepilogoSlice"
import { piattaformaSchema } from "../utils/schema"
import { cruscottoToFormSteps } from "../utils/cruscottoMapper"
import * as yup from "yup"
import { useRuoliWizard } from "../hooks/useRuoliWizard"
import { useGruppiWizard } from "../hooks/useGruppiWizard"

export function PlatformWizardPage({ initialPiattaforma, onDone, onCancel }: PlatformWizardPageProps) {
    const dispatch = useAppDispatch()
    const [persist] = usePersistMutation()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [validatePiattaforma, { isLoading: isValidating }] = useValidatePiattaformaInitMutation()
    const [ruoloToDelete, setRuoloToDelete] = useState<Ruolo | null>(null)
    const [deleteGruppoModalOpen, setDeleteGruppoModalOpen] = useState(false)
    const [gruppoToDelete, setGruppoToDelete] = useState<Gruppo | null>(null)
    const [step, setStep] = useState(2)
    const [piattaformaErrors, setPiattaformaErrors] = useState<Record<string, string>>({})
    const [cruscottoConfirmOpen, setCruscottoConfirmOpen] = useState(false)
    const [pendingPiattaforma, setPendingPiattaforma] = useState<Piattaforma | null>(null)
    const [cruscottoResync, setCruscottoResync] = useState(0)
    const [roleDraft, setRoleDraft] = useState<Ruolo | null>(null)
    const [groupDraft, setGroupDraft] = useState<Gruppo | null>(null)
    const [modalContext, setModalContext] = useState<"save" | "export" | null>(null)
    const [tipoAbilitazione] = useState<"TICKET" | "VERTICALE">("TICKET")
    const ruoliTempIdCounter = useRef(-1)
    const gruppiTempIdCounter = useRef(-1)
    const ruoliLoaded = useRef(false)
    const gruppiLoaded = useRef(false)
    const [resultModalOpen, setResultModalOpen] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [saveErrors, setSaveErrors] = useState<string[]>([])
    const [saveGenericError, setSaveGenericError] = useState(false)
    const { exportSql, isLoading: isExporting } = useExport()
    const { ruoli, handleAddRuolo, handleUpdateRuolo, confirmDeleteRuolo } = useRuoliWizard()
    const { editedGruppi, mergedGruppi, handleAddGruppo, handleUpdateGruppo, confirmDeleteGruppo } = useGruppiWizard()

    const piattaforma = useAppSelector((state) => state.riepilogo.piattaforma)
    const abilitazioni = useAppSelector((state) => state.riepilogo.abilitazioni)
    const cruscotto = useAppSelector((state) => state.riepilogo.cruscotto)

    const { data: ruoliData } = useGetRuoliQuery(piattaforma?.id ?? skipToken)
    const { data: gruppiData } = useGetGruppiAllQuery()
    const { data: dependenciesData, isLoading: depsLoading } = useGetGruppoDependenciesQuery(gruppoToDelete?.id ?? skipToken)

    const handleResultModalClose = () => {
        setResultModalOpen(false)
        if (saveSuccess) {
            dispatch(resetRiepilogo())
            onDone()
        }
        setModalContext(null)
    }

    const handleExport = async () => {
        try {
            const payload: PersistenceObject = {
                piattaforma: { ...piattaforma!, formSteps: cruscottoToFormSteps(cruscotto) },
                ruoli: ruoli,
                gruppiAppartenenza: editedGruppi,
                abilitazioni: abilitazioni
            }
            await exportSql(payload)
            setSaveSuccess(true)
            setSaveErrors([])
            setSaveGenericError(false)
            setModalContext("export")
            setResultModalOpen(true)
        } catch (err) {
            setSaveSuccess(false)
            setSaveErrors([err instanceof Error ? err.message : "Errore sconosciuto"])
            setSaveGenericError(false)
            setModalContext("export")
            setResultModalOpen(true)
        }
    }

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
            dispatch(setMainGruppi(gruppiData))
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
        if (step === 6) {
            const cruscottoPulito = cruscotto.map((c) => {
                if (c.chiave !== "STEP_DATI" && c.chiave !== "STEP_METADATI") return c
                const usati = new Set<number>()
                c.sezioni.forEach((s) => s.gruppiIds.forEach((id) => usati.add(id)))
                return { ...c, gruppiIds: c.gruppiIds.filter((id) => usati.has(id)) }
            })
            dispatch(setCruscotto(cruscottoPulito))
        }
        setStep((s) => Math.min(7, s + 1))
    }

    async function saveFinalConfiguration() {
        try {
            const payload: PersistenceObject = {
                piattaforma: { ...piattaforma!, formSteps: cruscottoToFormSteps(cruscotto) },
                ruoli: ruoli,
                gruppiAppartenenza: editedGruppi,
                abilitazioni: abilitazioni
            }
            const result = await persist(payload).unwrap()
            if (Array.isArray(result) && result.length > 0) {
                setSaveSuccess(false)
                setSaveErrors(result)
                setSaveGenericError(false)
            } else {
                setSaveSuccess(true)
                setSaveErrors([])
                setSaveGenericError(false)
            }
            setModalContext("save")
            setResultModalOpen(true)
        } catch (err: any) {
            console.error("Salvataggio fallito: ", err)
            setSaveSuccess(false)
            setSaveErrors([])
            setSaveGenericError(true)
            setResultModalOpen(true)
        }
    }

    const handleDeleteRuolo = (ruolo: Ruolo) => {
        setRuoloToDelete(ruolo)
        setDeleteModalOpen(true)
    }
    const handleDeleteGruppo = (gruppo: Gruppo) => {
        setGruppoToDelete(gruppo)
        setDeleteGruppoModalOpen(true)
    }

    const handlePiattaformaChange = (updated: Piattaforma) => {
        const prev = piattaforma ?? initialPiattaforma
        const disattivaCruscotto = Boolean(prev.richiedibileDaCruscotto) && !updated.richiedibileDaCruscotto
        const cruscottoHaDati = piattaforma?.formSteps?.some(
            (s) =>
                s.descrizione?.trim() !== "" ||
                (s.role_groups != undefined && s.role_groups!.length > 0) ||
                (s.sections != undefined && s.sections!.length > 0)
        )
        console.log(cruscotto)
        if (disattivaCruscotto && cruscottoHaDati) {
            setPendingPiattaforma(updated)
            setCruscottoConfirmOpen(true)
            setCruscottoResync((n) => n + 1)
            return
        }
        if (disattivaCruscotto) {
            dispatch(setCruscotto([]))
        }
        dispatch(updateRiepilogoPiattaforma(updated))
    }

    const confermaSvuotaCruscotto = () => {
        if (pendingPiattaforma) {
            dispatch(setCruscotto([]))
            dispatch(updateRiepilogoPiattaforma(pendingPiattaforma))
        }
        setPendingPiattaforma(null)
        setCruscottoConfirmOpen(false)
    }

    const annullaSvuotaCruscotto = () => {
        setPendingPiattaforma(null)
        setCruscottoConfirmOpen(false)
        setCruscottoResync((n) => n + 1)
    }

    return (
        <>
            <Stepper currentStep={step} />
            {step === 2 && (
                <PiattaformaStep
                    key={`piatt-resync-${cruscottoResync}`}
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
                    gruppi={mergedGruppi}
                    ruoli={ruoli}
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
            {step === 6 && <CruscottoStep piattaforma={piattaforma ?? initialPiattaforma} />}
            {step === 7 && (
                <RiepilogoStep
                    gruppi={editedGruppi}
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
                {step === 7 ? (
                    <div className="flex gap-2">
                        <button
                            className="btn-primary"
                            onClick={() => void saveFinalConfiguration()}
                            disabled={isExporting}
                            type="button">
                            Salva configurazione
                        </button>
                        <button
                            className="btn-secondary border border-gray-300"
                            onClick={() => void handleExport()}
                            disabled={isExporting}
                            type="button">
                            {isExporting ? "Esportazione..." : "📦 Esporta SQL"}
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={nextStep}
                        type="button">
                        Avanti
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
                        const exists = mergedGruppi.some((g) => g.id === group.id)
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
                onConfirm={() => {
                    if (ruoloToDelete) {
                        confirmDeleteRuolo(ruoloToDelete)
                        setRuoloToDelete(null)
                        setDeleteModalOpen(false)
                    }
                }}
                message="Sei sicuro di voler eliminare questo ruolo? L'operazione non è reversibile."
            />
            <DeleteConfirmationModal
                isOpen={cruscottoConfirmOpen}
                onClose={annullaSvuotaCruscotto}
                onConfirm={confermaSvuotaCruscotto}
                title="Attenzione: i dati in cruscotto verranno cancellati"
                message="Sono presenti dati nella pagina cruscotto. Disabilitando 'Richiedibile da cruscotto' i dati in cruscotto verranno cancellati. Vuoi procedere?"
                confirmLabel="Disabilita e cancella"
                cancelLabel="Annulla"
            />
            <DeleteConfirmationModal
                isOpen={deleteGruppoModalOpen}
                onClose={() => {
                    setDeleteGruppoModalOpen(false)
                    setGruppoToDelete(null)
                }}
                onConfirm={() => {
                    if (gruppoToDelete) {
                        confirmDeleteGruppo(gruppoToDelete)
                        setGruppoToDelete(null)
                        setDeleteGruppoModalOpen(false)
                    }
                }}
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
            <ResultModal
                isOpen={resultModalOpen}
                onClose={handleResultModalClose}
                success={saveSuccess}
                errors={saveErrors}
                genericError={saveGenericError}
                title={modalContext === "export" ? (saveSuccess ? "Esportazione completata" : "Errore esportazione") : undefined}
                message={
                    modalContext === "export" ? (saveSuccess ? "Il file ZIP è stato scaricato correttamente." : saveErrors.join("\n")) : undefined
                }
            />
        </>
    )
}

export { emptyPiattaforma } from "../types/type"
