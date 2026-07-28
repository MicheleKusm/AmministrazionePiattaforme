import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import type { ResultModalProps } from "../../types/type"

export function ResultModal({ isOpen, onClose, success, errors, genericError, title: customTitle, message: customMessage }: ResultModalProps) {
    if (!isOpen) return null

    const title = customTitle || (success ? "Operazione completata" : "Errore")
    const headerClassName = success ? "bg-green-700 text-white" : "bg-red-700 text-white"
    const modalClassName = success ? "border-0" : "border-0"
    const textClassName = success ? "text-green-800" : "text-red-800"

    let message = customMessage || ""
    if (!customMessage) {
        if (success) {
            message = "La piattaforma e i suoi elementi sono stati salvati correttamente."
        } else if (genericError) {
            message = "Qualcosa è andato storto. Riprova più tardi."
        } else if (errors && errors.length > 0) {
            message = errors.join("\n")
        } else {
            message = "Errore sconosciuto."
        }
    }

    const footer = (
        <Button
            variant={success ? "success" : "danger"}
            onClick={onClose}>
            {success ? "OK" : "Chiudi"}
        </Button>
    )

    return (
        <Modal
            headerClassName={headerClassName}
            modalClassName={modalClassName}
            title={title}
            onClose={onClose}
            footer={footer}>
            <div className={`whitespace-pre-line text-sm ${textClassName}`}>{message}</div>
        </Modal>
    )
}
