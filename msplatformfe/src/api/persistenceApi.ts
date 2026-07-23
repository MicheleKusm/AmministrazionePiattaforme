import { platformApi } from "./rootApi"
import type { PersistenceObject } from "../types/type"
import { PERSIST } from "../api/apiConstants"

export const persistenceApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        persist: build.mutation<void, PersistenceObject>({
            query: (data) => ({
                url: PERSIST,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Piattaforme", "Ruoli", "Gruppi"]
        })
    }),
    overrideExisting: false
})

export const { usePersistMutation } = persistenceApi
