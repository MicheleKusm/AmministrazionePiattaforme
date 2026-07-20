import * as yup from "yup"
import { Constants } from "./Constants"

const regex_no_spec_chars = Constants.regex.REGEX_NO_SPECIAL_CHARACTERS

export const ruoloSchema = yup.object().shape({
    nome: yup
        .string()
        .required("Il nome è obbligatorio")
        .matches(regex_no_spec_chars, "Solo lettere, numeri, underscore, dash, dot e # sono ammessi"),
    descrizione: yup.string().nullable(),
    richiedibileDaProcesso: yup.boolean().default(false)
})

export type RuoloFormData = yup.InferType<typeof ruoloSchema>
