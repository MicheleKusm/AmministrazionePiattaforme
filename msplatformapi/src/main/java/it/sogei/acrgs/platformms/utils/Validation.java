package it.sogei.acrgs.platformms.utils;

import it.sogei.acrgs.platformms.dto.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import static it.sogei.acrgs.platformms.utils.Constants.REGEX_NOMI;
import static it.sogei.acrgs.platformms.utils.Constants.REGEX_DESCRIZIONI;

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
            if (!errors.isEmpty()) {
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
        log.debug("validazionePersistenceObject, INIZIO, persistenceObjectDTO: {}", persistenceObjectDTO);
        if (null == persistenceObjectDTO) {
            log.error("Errore nella ricezione dei dati, persistenceDTO nullo");
            errors.add("Errore nella ricezione dei dati, persistenceDTO nullo");
            return;
        }
        validazionePiattaforma(persistenceObjectDTO.getPiattaforma(), errors);
        validazioneRuoli(persistenceObjectDTO.getRuoli(), errors);
        validazioneGruppoAppartenenza(persistenceObjectDTO.getGruppiAppartenenza(), errors);
        log.debug("validazionePersistenceObject, FINE");
    }

    private void validazionePiattaforma (PiattaformaDTO dto, List<String> errors) {
        try {
            int initialSize = errors.size();
            boolean skipName = false;
            boolean skipDescription = false;
            boolean skipObjClass = false;
            if (null == dto) {
                log.error("Errore nella ricezione dei dati, piattaforma nulla");
                errors.add("Errore nella ricezione dei dati, piattaforma nulla");
                return;
            }
            if (null == dto.getNome() || dto.getNome().isBlank()) {
                log.error("Errore nella validazione della piattaforma, nome piattaforma nullo");
                errors.add("Errore nella validazione della piattaforma, nome piattaforma nullo");
                skipName = true;
            }
            if (!skipName && dto.getNome().length() > 255) {
                log.error("Errore nella validazione della piattaforma, nome piattaforma troppo lungo");
                errors.add("Errore nella validazione della piattaforma, nome piattaforma troppo lungo");
            }
            if (!skipName && !dto.getNome().matches(REGEX_NOMI)) {
                log.error("Errore nella validazione della piattaforma, nome piattaforma non valido");
                errors.add("Errore nella validazione della piattaforma, nome piattaforma non valido");
            }
            if (null == dto.getDescrizione() || dto.getDescrizione().isBlank()) {
                log.error("Errore nella validazione della piattaforma, descrizione piattaforma nullo");
                errors.add("Errore nella validazione della piattaforma, descrizione piattaforma nullo");
                skipDescription = true;
            }
            if (!skipDescription && dto.getDescrizione().length() > 255) {
                log.error("Errore nella validazione della piattaforma, descrizione piattaforma troppo lunga");
                errors.add("Errore nella validazione della piattaforma, descrizione piattaforma troppo lunga");
            }
            if (!skipDescription && !dto.getDescrizione().matches(REGEX_DESCRIZIONI)) {
                log.error("Errore nella validazione della piattaforma, descrizione piattaforma non valida");
                errors.add("Errore nella validazione della piattaforma, descrizione piattaforma non valida");
            }
            if (null == dto.getObjClass() || dto.getObjClass().isBlank()) {
                log.error("Errore nella validazione della piattaforma, objClass piattaforma nullo");
                errors.add("Errore nella validazione della piattaforma, objClass piattaforma nullo");
                skipObjClass = true;
            }
            if (!skipObjClass && dto.getObjClass().length() > 255) {
                log.error("Errore nella validazione della piattaforma, objClass piattaforma troppo lungo");
                errors.add("Errore nella validazione della piattaforma, objClass piattaforma troppo lungo");
            }
            if (!skipObjClass && !dto.getObjClass().matches(REGEX_NOMI)) {
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
            int initialSize = errors.size();
            boolean skipName = false;
            boolean skipDescription = false;
            if (null == ruoli || ruoli.isEmpty()) {
                log.debug("Nessun ruolo presente, validazione non necessaria");
                return;
            }
            for (RuoloDTO ruolo : ruoli) {
                if (null == ruolo.getNome() || ruolo.getNome().isBlank()) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo nullo");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo nullo");
                    skipName = true;
                }
                if (skipName && ruolo.getNome().length() > 255) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo troppo lungo");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo troppo lungo");
                }
                if (skipName && !ruolo.getNome().matches(REGEX_NOMI)) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo non valido");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo non valido");
                }
                if (null == ruolo.getDescrizione() || ruolo.getDescrizione().isBlank()) {
                    log.error("Errore nella validazione dei ruoli, descrizione ruolo nullo");
                    errors.add("Errore nella validazione dei ruoli, descrizione ruolo nullo");
                    skipDescription = true;
                }
                if (!skipDescription && ruolo.getDescrizione().length() > 255) {
                    log.error("Errore nella validazione dei ruoli, descrizione ruolo troppo lunga");
                    errors.add("Errore nella validazione dei ruoli, descrizione ruolo troppo lunga");
                }
                if (!skipDescription && !ruolo.getDescrizione().matches(REGEX_DESCRIZIONI)) {
                    log.error("Errore nella validazione dei ruoli, descrizione ruolo non valida");
                    errors.add("Errore nella validazione dei ruoli, descrizione ruolo non valida");
                }
                skipName = false;
                skipDescription = false;
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
            int initialSize = errors.size();
            boolean skipName = false;
            boolean skipDescription = false;
            if (null == gruppi || gruppi.isEmpty()) {
                log.debug("Nessun gruppoAppartenenza presente, validazione non necessaria");
                return;
            }
            for (GruppoAppartenenzaDTO gruppo : gruppi) {
                if (null == gruppo.getNome() || gruppo.getNome().isBlank()) {
                    log.error("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza nullo");
                    errors.add("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza nullo");
                    skipName = true;
                }
                if (!skipName && gruppo.getNome().length() > 255) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza troppo lungo");
                    log.error("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza troppo lungo");
                }
                if (!skipName && !gruppo.getNome().matches(REGEX_NOMI)) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza non valido");
                    log.error("Errore nella validazione del gruppoAppartenenza, nome gruppoAppartenenza non valido");
                }
                if (null == gruppo.getDescrizione() || gruppo.getDescrizione().isBlank()) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza nullo");
                    log.error("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza nullo");
                    skipDescription = true;
                }
                if (!skipDescription && gruppo.getDescrizione().length() > 255) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza troppo lunga");
                    log.error("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza troppo lunga");
                }
                if (!skipDescription && !gruppo.getDescrizione().matches(REGEX_DESCRIZIONI)) {
                    errors.add("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza non valida");
                    log.error("Errore nella validazione del gruppoAppartenenza, descrizione gruppoAppartenenza non valida");
                }
                skipName = false;
                skipDescription = false;
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
            int initialSize = errors.size();
            boolean skipNome = false; //ecc
            if (null == abilitazioni || abilitazioni.isEmpty()) {
                log.debug("Nessuna abilitazione presente, validazione non necessaria");
                return;
            }
            for (AbilitazioneDTO abilitazione : abilitazioni) {
                //TODO

                // reset skip a ogni ciclo
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione delle abilitazioni: {}", exception.getMessage());
            errors.add("Errore nella validazione delle abilitazioni");
        }
    }
}
