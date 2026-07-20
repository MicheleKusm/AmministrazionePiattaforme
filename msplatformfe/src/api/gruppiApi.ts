import { platformApi } from "./rootApi";
import { GRUPPI } from "./apiConstants";
import type { Gruppo } from "../types/type";

const gruppiApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        getGruppi: build.query<Gruppo[], number>({
            query: (idPiattaforma) => ({
                url: `${GRUPPI}?piattaformaId=${idPiattaforma}`,
                method: "GET"
            }),
            providesTags: ["Gruppi"]
        }),
        saveGruppo: build.mutation<void, { idPiattaforma: number; gruppo: Gruppo }>({
            query: ({ idPiattaforma, gruppo }) => ({
                url: gruppo.id ? `${GRUPPI}/${gruppo.id}` : GRUPPI,
                method: gruppo.id ? "PUT" : "POST",
                body: {
                    idPiattaforma,
                    nome: gruppo.nome,
                    descrizione: gruppo.descrizione,
                    ruoliIds: gruppo.ruoliIds
                }
            }),
            invalidatesTags: ["Gruppi"]
        })
    }),
    overrideExisting: false
});

export const { useGetGruppiQuery, useSaveGruppoMutation } = gruppiApi;
