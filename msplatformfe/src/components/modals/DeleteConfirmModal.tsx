import { DeleteConfirmationModalProps } from "../../types/type"
import { Modal } from "../../components/common/Modal"
import { Button } from "../../components/common/Button"

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Conferma eliminazione",
    message = "Sei sicuro di voler eliminare questo elemento? L'operazione non è reversibile.",
    confirmLabel = "Elimina",
    cancelLabel = "Annulla"
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <Modal
            title={title}
            onClose={onClose}
            footer={
                <>
                    <Button
                        variant="secondary"
                        onClick={onClose}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </>
            }>
            <p className="text-sm text-gray-700">{message}</p>
        </Modal>
    )
}
