import { platformApi } from "./rootApi"
import type { PersistenceObject } from "../types/type"

export const exportApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        exportSql: build.mutation<Blob, PersistenceObject>({
            query: (data) => ({
                url: "/persistence/export",
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob()
            }),
            transformErrorResponse: async (response) => {
                let message = "Errore durante l'esportazione"
                if (response.data) {
                    if (response.data instanceof Blob) {
                        try {
                            const text = await response.data.text()
                            message = text.replace(/^ERROR:\s*/i, "").trim()
                        } catch (e) {
                            console.warn("Impossibile leggere errore blob come testo:", e)
                        }
                    } else if (typeof response.data === "string") {
                        message = response.data
                    } else if (typeof response.data === "object") {
                        message = JSON.stringify(response.data)
                    }
                }
                return {
                    data: { message },
                    status: response.status || 500
                }
            }
        })
    }),
    overrideExisting: false
})

export const { useExportSqlMutation } = exportApi
