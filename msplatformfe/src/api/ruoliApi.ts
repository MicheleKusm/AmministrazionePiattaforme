import { platformApi } from "./rootApi";
import { RUOLI, RUOLI_ALL } from "./apiConstants";
import type { Ruolo } from "../types/type";

const ruoliApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        getRuoli: build.query<Ruolo[], number>({
            query: (idPiattaforma) => ({
                url: `${RUOLI}?piattaformaId=${idPiattaforma}`,
                method: "GET"
            }),
            providesTags: ["Ruoli"]
        }),
        getRuoliAll: build.query<Ruolo[], void>({
            query: () => ({
                url: RUOLI_ALL,
                method: "GET"
            }),
            providesTags: ["Ruoli"]
        }),
        saveRuolo: build.mutation<void, { idPiattaforma: number; ruolo: Ruolo }>({
            query: ({ idPiattaforma, ruolo }) => ({
                url: ruolo.id ? `${RUOLI}/${ruolo.id}` : RUOLI,
                method: ruolo.id ? "PUT" : "POST",
                body: {
                    idPiattaforma,
                    nome: ruolo.nome,
                    descrizione: ruolo.descrizione,
                    richiedibileDaProcesso: ruolo.richiedibileDaProcesso
                }
            }),
            invalidatesTags: ["Ruoli"]
        })
    }),
    overrideExisting: false
});

export const { useGetRuoliQuery, useGetRuoliAllQuery, useSaveRuoloMutation } = ruoliApi;
