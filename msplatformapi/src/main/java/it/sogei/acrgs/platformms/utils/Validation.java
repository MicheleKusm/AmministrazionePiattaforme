package it.sogei.acrgs.platformms.utils;

import it.sogei.acrgs.platformms.dto.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import static it.sogei.acrgs.platformms.utils.Constants.REGEX_PLACEHOLDER1;
import static it.sogei.acrgs.platformms.utils.Constants.REGEX_PLACEHOLDER2;

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

    public void validazionePersistenceObject (PersistenceObjectDTO persistenceObjectDTO, List<String> errors) {
        if (null == persistenceObjectDTO) {
            log.error("Errore nella ricezione dei dati, persistenceDTO nullo");
            errors.add("Errore nella ricezione dei dati, persistenceDTO nullo");
            return;
        }
        validazionePiattaforma(persistenceObjectDTO.getPiattaforma(), errors);
        validazioneRuoli(persistenceObjectDTO.getRuoli(), errors);
        validazioneGruppoAppartenenza(persistenceObjectDTO.getGruppiAppartenenza(), errors);

    }

    private void validazionePiattaforma (PiattaformaDTO dto, List<String> errors) {
        try {
            Integer initialSize = errors.size();
            boolean skip = false;
            if (null == dto) {
                log.error("Errore nella ricezione dei dati, piattaforma nulla");
                errors.add("Errore nella ricezione dei dati, piattaforma nulla");
                skip = true;
            }
            if (!skip && null == dto.getNome() || dto.getNome().isBlank()) {
                log.error("Errore nella validazione della piattaforma, nome piattaforma nullo");
                errors.add("Errore nella validazione della piattaforma, nome piattaforma nullo");
                skip = true;
            }
            if (!skip && dto.getNome().length() > 255) {
                log.error("Errore nella validazione della piattaforma, nome piattaforma troppo lungo");
                errors.add("Errore nella validazione della piattaforma, nome piattaforma troppo lungo");
            }
            if (!skip && dto.getNome().matches(REGEX_PLACEHOLDER1)) {
                log.error("Errore nella validazione della piattaforma, nome piattaforma non valido");
                errors.add("Errore nella validazione della piattaforma, nome piattaforma non valido");
            }
            if (!skip && null == dto.getDescrizione() || dto.getDescrizione().isBlank()) {
                log.error("Errore nella validazione della piattaforma, descrizione piattaforma nullo");
                errors.add("Errore nella validazione della piattaforma, descrizione piattaforma nullo");
                skip = true;
            }
            if (!skip && dto.getDescrizione().length() > 255) {
                log.error("Errore nella validazione della piattaforma, descrizione piattaforma troppo lunga");
                errors.add("Errore nella validazione della piattaforma, descrizione piattaforma troppo lunga");
            }
            if (!skip && dto.getDescrizione().matches(REGEX_PLACEHOLDER2)) {
                log.error("Errore nella validazione della piattaforma, descrizione piattaforma non valida");
                errors.add("Errore nella validazione della piattaforma, descrizione piattaforma non valida");
            }
            if (!skip && null == dto.getObjClass() || dto.getObjClass().isBlank()) {
                log.error("Errore nella validazione della piattaforma, objClass piattaforma nullo");
                errors.add("Errore nella validazione della piattaforma, objClass piattaforma nullo");
                skip = true;
            }
            if (!skip && dto.getObjClass().length() > 255) {
                log.error("Errore nella validazione della piattaforma, objClass piattaforma troppo lungo");
                errors.add("Errore nella validazione della piattaforma, objClass piattaforma troppo lungo");
            }
            if (!skip && dto.getObjClass().matches(REGEX_PLACEHOLDER1)) {
                log.error("Errore nella validazione della piattaforma, objClass piattaforma non valido");
                errors.add("Errore nella validazione della piattaforma, objClass piattaforma non valido");
            }
            if (errors.size() > initialSize) {
                log.error("Errore nella validazione della piattaforma: {}", errors);
            } else {
                log.debug("Validazione della piattaforma completata");
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione della piattaforma: {}", exception.getMessage());
            errors.add("Errore nella validazione della piattaforma");
        }
    }

    private void validazioneRuoli (List<RuoloDTO> ruoli, List<String> errors) {
        try {
            Integer initialSize = errors.size();
            boolean skip = false;
            if (null == ruoli || ruoli.isEmpty()) {
                log.debug("Nessun ruolo presente, validazione non necessaria");
                return;
            }
            for (RuoloDTO ruolo : ruoli) {
                if (!skip && null == ruolo.getNome() || ruolo.getNome().isBlank()) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo nullo");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo nullo");
                    skip = true;
                }
                if (!skip && ruolo.getNome().length() > 255) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo troppo lungo");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo troppo lungo");
                }
                if (!skip && ruolo.getNome().matches(REGEX_PLACEHOLDER1)) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo non valido");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo non valido");
                }
                skip = false;
            }
            if (errors.size() > initialSize) {
                log.error("Errore nella validazione dei ruoli: {}", errors);
            } else {
                log.debug("Validazione dei ruoli completata");
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione dei ruoli: {}", exception.getMessage());
            errors.add("Errore nella validazione dei ruoli");
        }
    }

    private void validazioneGruppoAppartenenza (List<GruppoAppartenenzaDTO> gruppi, List<String> errors) {
        try {
            Integer initialSize = errors.size();
            boolean skip = false;
            if (null == gruppi || gruppi.isEmpty()) {
                log.debug("Nessun gruppoAppartenenza presente, validazione non necessaria");
                return;
            }
            for (GruppoAppartenenzaDTO gruppo : gruppi) {
                if (null == gruppo.getNome() || gruppo.getNome().isBlank()) {
                    log.error("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza nullo");
                    errors.add("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza nullo");
                    skip = true;
                }
                if (!skip && gruppo.getNome().length() > 255) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza troppo lungo");
                    log.error("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza troppo lungo");
                }
                if (!skip && gruppo.getNome().matches(REGEX_PLACEHOLDER1)) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza non valido");
                    log.error("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza non valido");
                }
                if (!skip && null == gruppo.getDescrizione() || gruppo.getDescrizione().isBlank()) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza nullo");
                    log.error("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza nullo");
                    skip = true;
                }
                if (!skip && gruppo.getDescrizione().length() > 255) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza troppo lunga");
                    log.error("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza troppo lunga");
                }
                if (!skip && gruppo.getDescrizione().matches(REGEX_PLACEHOLDER2)) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza non valida");
                    log.error("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza non valida");
                }
                skip = false;
            }
            if (errors.size() > initialSize) {
                log.error("Errore nella validazione del gruppoAppartenenza: {}", errors);
            } else {
                log.debug("Validazione del gruppoAppartenenza completata");
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione del gruppoAppartenenza: {}", exception.getMessage());
            errors.add("Errore nella validazione del gruppoAppartenenza");
        }
    }

    private void validazioneAbilitazioni (List<AbilitazioneDTO> abilitazioni, List<String> errors) {
        try {
            Integer initialSize = errors.size();
            boolean skip = false;
            if (null == abilitazioni || abilitazioni.isEmpty()) {
                log.debug("Nessuna abilitazione presente, validazione non necessaria");
                return;
            }
            for (AbilitazioneDTO abilitazione : abilitazioni) {
                //TODO
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione delle abilitazioni: {}", exception.getMessage());
            errors.add("Errore nella validazione delle abilitazioni");
        }
    }
}
