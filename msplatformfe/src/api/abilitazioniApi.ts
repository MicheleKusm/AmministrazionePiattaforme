import { platformApi } from "./rootApi"
import { ABILITAZIONI, ABILITAZIONI_ICONE, ABILITAZIONI_PROCESSI, ABILITAZIONI_TIPOLOGICHE } from "./apiConstants"
import type { Abilitazione, TipologicaCampoDinamico } from "../types/type"

const abilitazioniApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        getAbilitazioni: build.query<Abilitazione[], number>({
            query: (piattaformaId) => ({
                url: `${ABILITAZIONI}?piattaformaId=${piattaformaId}`,
                method: "GET"
            }),
            providesTags: ["Abilitazioni"]
        }),
        getTipologiche: build.query<TipologicaCampoDinamico[], void>({
            query: () => ({
                url: ABILITAZIONI_TIPOLOGICHE,
                method: "GET"
            })
        }),
        getProcessiVerticali: build.query<string[], void>({
            query: () => ({
                url: ABILITAZIONI_PROCESSI,
                method: "GET"
            })
        }),
        getIcone: build.query<string[], void>({
            query: () => ({
                url: ABILITAZIONI_ICONE,
                method: "GET"
            })
        }),
        saveAbilitazione: build.mutation<Abilitazione, { idPiattaforma: number; abilitazione: Abilitazione }>({
            query: ({ idPiattaforma, abilitazione }) => ({
                url: abilitazione.id ? `${ABILITAZIONI}/${abilitazione.id}` : ABILITAZIONI,
                method: abilitazione.id ? "PUT" : "POST",
                body: { ...abilitazione, idPiattaforma }
            }),
            invalidatesTags: ["Abilitazioni"]
        }),
        deleteAbilitazione: build.mutation<void, number>({
            query: (id) => ({
                url: `${ABILITAZIONI}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Abilitazioni"]
        })
    }),
    overrideExisting: false
})

export const { useGetAbilitazioniQuery, useGetTipologicheQuery, useGetProcessiVerticaliQuery, useGetIconeQuery } = abilitazioniApi
