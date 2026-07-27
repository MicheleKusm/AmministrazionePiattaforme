import { useState } from "react"
import type { PersistenceObject } from "../types/type"

type ExportResult = {
    exportSql: (payload: PersistenceObject) => Promise<void>
    isLoading: boolean
    error: string | null
}

export function useExport(): ExportResult {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const exportSql = async (payload: PersistenceObject) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/persistence/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            if (!response.ok) {
                const text = await response.text()
                throw new Error(text)
            }
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "export.zip"
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Errore durante l'esportazione."
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { exportSql, isLoading, error }
}
