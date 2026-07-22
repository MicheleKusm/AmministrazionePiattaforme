import { platformApi } from "./rootApi";
import { PIATTAFORME } from "./apiConstants";
import type { PageResponse, Piattaforma } from "../types/type";

const piattaformeApi = platformApi.injectEndpoints({
    endpoints: (build) => ({
        getPiattaforme: build.query<PageResponse<Piattaforma>, { search: string; page: number; size: number }>({
            query: ({ search, page, size }) => ({
                url: `${PIATTAFORME}?search=${encodeURIComponent(search)}&page=${page}&size=${size}`,
                method: "GET"
            }),
            providesTags: ["Piattaforme"]
        }),
        getAllPiattaforme: build.query<Piattaforma[], void>({
            query: () => ({
                url: `${PIATTAFORME}/all`,
                method: "GET"
            }),
            providesTags: ["Piattaforme"]
        }),
        savePiattaforma: build.mutation<Piattaforma, Piattaforma>({
            query: (piattaforma) => ({
                url: piattaforma.id ? `${PIATTAFORME}/${piattaforma.id}` : PIATTAFORME,
                method: piattaforma.id ? "PUT" : "POST",
                body: piattaforma
            }),
            invalidatesTags: ["Piattaforme"]
        })
    }),
    overrideExisting: false
})

export const { useGetPiattaformeQuery, useGetAllPiattaformeQuery, useSavePiattaformaMutation } = piattaformeApi;
