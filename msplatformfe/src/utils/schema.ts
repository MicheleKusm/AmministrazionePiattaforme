import * as yup from "yup"
import { Constants } from "./Constants"

const regex_no_spec_chars = Constants.regex.REGEX_NO_SPECIAL_CHARACTERS
const { MAX_100, MAX_255, MAX_500 } = Constants.validation

export const ruoloSchema = yup.object().shape({
    nome: yup
        .string()
        .trim()
        .required("Il nome è obbligatorio")
        .matches(regex_no_spec_chars, "Solo lettere, numeri, underscore, dash, dot e # sono ammessi"),
    descrizione: yup.string().nullable(),
    richiedibileDaProcesso: yup.boolean().default(false)
})

export const gruppoSchema = yup.object().shape({
    nome: yup.string().trim().required("Il nome è obbligatorio"),
    descrizione: yup.string().trim().required("La descrizione è obbligatoria"),
    ruoliIds: yup.array().of(yup.number()).default([])
})

export const piattaformaSchema = yup.object().shape({
    nome: yup.string().trim().required("Il nome è obbligatorio").max(MAX_255, `Massimo ${MAX_255} caratteri`),
    descrizione: yup.string().required("La descrizione è obbligatoria").max(MAX_255, `Massimo ${MAX_255} caratteri`),
    url: yup.string().nullable().max(MAX_255, `Massimo ${MAX_255} caratteri`),
    canale: yup.string().nullable().max(MAX_500, `Massimo ${MAX_500} caratteri`),
    objClass: yup.string().required("ObjClass è obbligatorio").max(MAX_255, `Massimo ${MAX_255} caratteri`),
    codiceIct: yup.string().nullable().max(MAX_100, `Massimo ${MAX_100} caratteri`),
    oamMetadataName: yup.string().nullable().max(MAX_255, `Massimo ${MAX_255} caratteri`),
    oamMetadataValue: yup.string().nullable().max(MAX_255, `Massimo ${MAX_255} caratteri`),
    readOnly: yup.boolean().default(false),
    richiedibileDaCruscotto: yup.boolean().default(false),
    richiedibileInCorso: yup.boolean().default(false),
    ripetibile: yup.boolean().default(false),
    utilizzoModelloAutorizzativo: yup.boolean().default(false),
    abilitazione: yup.string().oneOf(["TICKET", "VERTICALE"]).nullable().notRequired()
})

export type GruppoFormData = yup.InferType<typeof gruppoSchema>
export type PiattaformaFormData = yup.InferType<typeof piattaformaSchema>
export type RuoloFormData = yup.InferType<typeof ruoloSchema>
