import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { ResultModalProps } from "../../types/type"

export function ResultModal({ isOpen, onClose, success, errors, genericError }: ResultModalProps) {
    if (!isOpen) return null
    const title = success ? "Operazione completata" : "Errore"
    let message = ""
    if (success) {
        message = "La piattaforma e i suoi elementi sono stati salvati correttamente."
    } else if (genericError) {
        message = "Qualcosa è andato storto. Riprova più tardi."
    } else if (errors && errors.length > 0) {
        message = errors.join("\n")
    } else {
        message = "Errore sconosciuto."
    }

    const footer = (
        <Button
            variant="primary"
            onClick={onClose}>
            {success ? "OK" : "Chiudi"}
        </Button>
    )
    return (
        <Modal
            title={title}
            onClose={onClose}
            footer={footer}>
            <div className="whitespace-pre-line text-sm text-gray-700">{message}</div>
        </Modal>
    )
}
