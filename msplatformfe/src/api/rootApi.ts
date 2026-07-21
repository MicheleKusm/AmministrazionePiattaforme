import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PLATFORM_API } from "./apiConstants";

export const platformApi = createApi({
    reducerPath: "platformApi",
    baseQuery: fetchBaseQuery({
        baseUrl: PLATFORM_API,
        prepareHeaders: (headers) => {
            return headers;
        }
    }),
    tagTypes: ["Piattaforme", "Ruoli", "Gruppi", "Abilitazioni"],
    endpoints: () => ({})
});
