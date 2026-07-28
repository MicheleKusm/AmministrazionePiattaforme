import { useState } from "react"
import type { PersistenceObject } from "../types/type"
import { useExportSqlMutation } from "../api/exportApi"

type ExportResult = {
    exportSql: (payload: PersistenceObject) => Promise<void>
    isLoading: boolean
    error: string | null
}

export function useExport(): ExportResult {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [trigger] = useExportSqlMutation()

    const exportSql = async (payload: PersistenceObject) => {
        setIsLoading(true)
        setError(null)
        try {
            const blob = await trigger(payload).unwrap()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "export.zip"
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        } catch (err: any) {
            const message = err?.data?.message || "Errore durante l'esportazione"
            setError(message)
            throw new Error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return { exportSql, isLoading, error }
}
