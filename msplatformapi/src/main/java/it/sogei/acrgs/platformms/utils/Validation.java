package it.sogei.acrgs.platformms.utils;

import it.sogei.acrgs.platformms.dto.PiattaformaDTO;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

// mettere validazioni qui, richiamare con new validation().nomeMetodo()
@Slf4j
public class Validation {

    public void validazioneNomeDescObjclass (PiattaformaDTO dto, List<String> errors) {
        try {
            log.info("validazioneNomeDescObjclass, INIZIO");
            if (null == dto.getNome() || dto.getNome().isBlank()) {
                log.debug("Validazione piattaforma fallita: il nome della piattaforma è obbligatorio");
                errors.add("Il nome della piattaforma è obbligatorio");
            }
            if (null == dto.getObjClass() || dto.getObjClass().isBlank()) {
                log.debug("Validazione piattaforma fallita: Obj_class piattaforma è obbligatorio");
                errors.add("Obj_class piattaforma è obbligatorio");
            }
            if (null == dto.getDescrizione() || dto.getDescrizione().isBlank()) {
                log.debug("Validazione piattaforma fallita: la descrizione è obbligatoria");
                errors.add("La descrizione della piattafoma è obbligatoria");
            }
            if (errors.size() > 0) {
                log.debug("Validazione nome, descrizione e objclass piattaforma fallita: {}", errors);
            } else {
                log.debug("Validazione nome, descrizione e objclass piattaforma completata");
            }
        } catch (Exception exception) {
            log.error("Errore durante la validazione della piattaforma: {}", exception.getMessage());
            errors.add("Errore generico durante la validazione della piattaforma");
        }
    }
}
