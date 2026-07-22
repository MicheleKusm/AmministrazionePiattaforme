import * as yup from "yup"
import { Constants } from "./Constants"
import { store } from "../store/store"

const regex_no_spec_chars = Constants.regex.REGEX_NO_SPECIAL_CHARACTERS

export const ruoloSchema = yup.object().shape({
    nome: yup
        .string()
        .required("Il nome è obbligatorio")
        .matches(regex_no_spec_chars, "Solo lettere, numeri, underscore, dash, dot e # sono ammessi"),
    descrizione: yup.string().nullable(),
    richiedibileDaProcesso: yup.boolean().default(false)
})

export const gruppoSchema = yup.object().shape({
    nome: yup.string().required("Il nome è obbligatorio"),
    descrizione: yup.string().nullable(),
    ruoliIds: yup.array().of(yup.number()).default([])
})

export const piattaformaSchema = yup.object().shape({
    nome: yup
        .string()
        .required("Il nome è obbligatorio")
        .test("unique-nome", "Nome già utilizzato da un'altra piattaforma", function (value) {
            if (!value) return true
            const state = store.getState()
            const currentId = this.options.context?.currentId
            const existing = state.piattaforme.items.find((p) => p.nome === value)
            return !(existing && existing.id !== currentId)
        }),
    descrizione: yup.string().required("La descrizione è obbligatoria"),
    url: yup.string().url("Inserisci un URL valido").nullable(),
    canale: yup.string().nullable(),
    objClass: yup
        .string()
        .required("ObjClass è obbligatorio")
        .test("unique-objclass", "ObjClass già utilizzato da un'altra piattaforma", function (value) {
            if (!value) return true
            const state = store.getState()
            const currentId = this.options.context?.currentId
            const existing = state.piattaforme.items.find((p) => p.objClass === value)
            return !(existing && existing.id !== currentId)
        }),
    readOnly: yup.boolean().default(false),
    codiceIct: yup.string().nullable(),
    oamMetadataName: yup.string().nullable(),
    oamMetadataValue: yup.string().nullable(),
    richiedibileDaCruscotto: yup.boolean().default(false),
    richiedibileInCorso: yup.boolean().default(false),
    ripetibile: yup.boolean().default(false),
    utilizzoModelloAutorizzativo: yup.boolean().default(false),
    abilitazione: yup.string().oneOf(["TICKET", "VERTICALE"]).required("L'abilitazione è obbligatoria")
})

export type GruppoFormData = yup.InferType<typeof gruppoSchema>
export type PiattaformaFormData = yup.InferType<typeof piattaformaSchema>
export type RuoloFormData = yup.InferType<typeof ruoloSchema>
