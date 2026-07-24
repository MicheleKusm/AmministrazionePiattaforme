import type { Abilitazione, AbilitazioneDto } from "../types/type"

// Converte il modello FE Abilitazione nella forma attesa dal backend (AbilitazioneDTO):
// campo->key, tipoValore->inputType, obbligatoria->required; per le comunicazioni descrizione->testo.
export function abilitazioneToDto(a: Abilitazione): AbilitazioneDto {
    return {
        id: a.id,
        nome: a.nome,
        tipo: a.tipo,
        riferimento: a.riferimento,
        stato: a.stato,
        processKey: a.processKey,
        codiceScim: a.codiceScim,
        processoVerticale: a.processoVerticale,
        daEliminare: a.daEliminare ?? false,
        campi: a.campi.map((c) => ({
            id: c.id,
            label: c.label,
            descrizione: c.descrizione,
            key: c.campo,
            inputType: c.tipoValore,
            required: c.obbligatoria,
            regex: c.regex
        })),
        comunicazioni: a.comunicazioni.map((co) => ({
            id: co.id,
            icona: co.icona,
            testo: co.testo,
            obbligatoria: co.obbligatoria
        }))
    }
}
