import { platformApi } from "./rootApi"
import { CRUSCOTTO, PIATTAFORME } from "./apiConstants"
import type { CruscottoStepConfig } from "../types/type"
import { formStepsToCruscotto, type FormStepDTO } from "../utils/cruscottoMapper"

const cruscottoApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        getCruscotto: build.query<CruscottoStepConfig[], number>({
            query: (piattaformaId) => ({
                url: `${PIATTAFORME}/${piattaformaId}${CRUSCOTTO}`,
                method: "GET"
            }),
            transformResponse: (raw: FormStepDTO[]) => formStepsToCruscotto(raw),
            providesTags: ["Piattaforme"]
        })
    }),
    overrideExisting: false
})

export const { useGetCruscottoQuery } = cruscottoApi
