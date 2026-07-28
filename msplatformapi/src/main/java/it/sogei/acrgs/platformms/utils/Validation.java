package it.sogei.acrgs.platformms.utils;

import it.sogei.acrgs.platformms.dto.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Set;

import static it.sogei.acrgs.platformms.utils.Constants.REGEX_DESCRIZIONI;
import static it.sogei.acrgs.platformms.utils.Constants.REGEX_NOMI;

// mettere validazioni qui, richiamare con new validation().nomeMetodo()
@Slf4j
public class Validation {

    private static final String TIPO_TICKET = "TICKET";
    private static final String TIPO_VERTICALE = "VERTICALE";

    private static final Set<String> TIPI_ICONA_AMMESSI = Set.of("Solid", "outline");

    public void validazioneNomeDescObjclass(PiattaformaDTO dto, List<String> errors) {
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

    public void validazionePersistenceObject(PersistenceObjectDTO persistenceObjectDTO, List<String> errors) {
        log.debug("validazionePersistenceObject, INIZIO, persistenceObjectDTO: {}", persistenceObjectDTO);
        if (null == persistenceObjectDTO) {
            log.error("Errore nella ricezione dei dati, persistenceDTO nullo");
            errors.add("Errore nella ricezione dei dati, persistenceDTO nullo");
            return;
        }
        validazionePiattaforma(persistenceObjectDTO.getPiattaforma(), errors);
        validazioneRuoli(persistenceObjectDTO.getRuoli(), errors);
        validazioneGruppoAppartenenza(persistenceObjectDTO.getGruppiAppartenenza(), errors);
        validazioneAbilitazioni(persistenceObjectDTO.getAbilitazioni(), errors);
        validazioneCruscotto(null != persistenceObjectDTO.getPiattaforma() ? persistenceObjectDTO.getPiattaforma().getFormSteps() : null, errors);
        log.debug("validazionePersistenceObject, FINE");
    }

    private void validazionePiattaforma(PiattaformaDTO dto, List<String> errors) {
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

    private void validazioneRuoli(List<RuoloDTO> ruoli, List<String> errors) {
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
                if (!skipName && ruolo.getNome().length() > 255) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo troppo lungo");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo troppo lungo");
                }
                if (!skipName && !ruolo.getNome().matches(REGEX_NOMI)) {
                    log.error("Errore nella validazione dei ruoli, nome ruolo non valido");
                    errors.add("Errore nella validazione dei ruoli, nome ruolo non valido");
                }
                if (null == ruolo.getDescrizione()) {
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

    private void validazioneGruppoAppartenenza(List<GruppoAppartenenzaDTO> gruppi, List<String> errors) {
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

    private void validazioneAbilitazioni(List<AbilitazioneDTO> abilitazioni, List<String> errors) {
        try {
            int initialSize = errors.size();
            boolean skipTipo = false;
            boolean skipScim = false;
            boolean skipProcesso = false;
            if (null == abilitazioni || abilitazioni.isEmpty()) {
                log.debug("Nessuna abilitazione presente, validazione non necessaria");
                return;
            }
            for (AbilitazioneDTO abilitazione : abilitazioni) {
                if (null == abilitazione) {
                    log.error("Errore nella validazione delle abilitazioni, abilitazione nulla");
                    errors.add("Errore nella validazione delle abilitazioni, abilitazione nulla");
                    continue;
                }
                // abilitazione marcata per l'eliminazione: nessuna validazione di contenuto
                if (abilitazione.isDaEliminare()) {
                    continue;
                }
                // tipo obbligatorio e deve essere TICKET o VERTICALE
                if (null == abilitazione.getTipo() || abilitazione.getTipo().isBlank()) {
                    log.error("Errore nella validazione delle abilitazioni, tipo abilitazione nullo");
                    errors.add("Errore nella validazione delle abilitazioni, tipo abilitazione nullo");
                    skipTipo = true;
                }
                boolean ticket = !skipTipo && TIPO_TICKET.equalsIgnoreCase(abilitazione.getTipo());
                boolean verticale = !skipTipo && TIPO_VERTICALE.equalsIgnoreCase(abilitazione.getTipo());
                if (!skipTipo && !ticket && !verticale) {
                    log.error("Errore nella validazione delle abilitazioni, tipo abilitazione non valido");
                    errors.add("Errore nella validazione delle abilitazioni, tipo abilitazione non valido");
                }
                // ticket -> codice SCIM obbligatorio
                if (ticket) {
                    if (null == abilitazione.getCodiceScim() || abilitazione.getCodiceScim().isBlank()) {
                        log.error("Errore nella validazione delle abilitazioni, codice SCIM obbligatorio per le abilitazioni ticket");
                        errors.add("Errore nella validazione delle abilitazioni, codice SCIM obbligatorio per le abilitazioni ticket");
                        skipScim = true;
                    }
                    if (!skipScim && abilitazione.getCodiceScim().length() > 255) {
                        log.error("Errore nella validazione delle abilitazioni, codice SCIM troppo lungo");
                        errors.add("Errore nella validazione delle abilitazioni, codice SCIM troppo lungo");
                    }
                }
                // verticale -> processo verticale obbligatorio
                if (verticale) {
                    if (null == abilitazione.getProcessoVerticale() || abilitazione.getProcessoVerticale().isBlank()) {
                        log.error("Errore nella validazione delle abilitazioni, processo verticale obbligatorio per le abilitazioni verticali");
                        errors.add("Errore nella validazione delle abilitazioni, processo verticale obbligatorio per le abilitazioni verticali");
                        skipProcesso = true;
                    }
                    if (!skipProcesso && abilitazione.getProcessoVerticale().length() > 255) {
                        log.error("Errore nella validazione delle abilitazioni, processo verticale troppo lungo");
                        errors.add("Errore nella validazione delle abilitazioni, processo verticale troppo lungo");
                    }
                }
                // campi ticket e comunicazioni onboarding
                validazioneCampiTicket(abilitazione.getCampi(), errors);
                validazioneComunicazioni(abilitazione.getComunicazioni(), errors);
                // reset skip a ogni ciclo
                skipTipo = false;
                skipScim = false;
                skipProcesso = false;
            }
            if (errors.size() > initialSize) {
                log.error("Errore nella validazione delle abilitazioni: {}", errors);
            } else {
                log.debug("Validazione delle abilitazioni completata");
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione delle abilitazioni: {}", exception.getMessage());
            errors.add("Errore nella validazione delle abilitazioni");
        }
    }

    private void validazioneCampiTicket(List<CampoTicketDTO> campi, List<String> errors) {
        boolean skipLabel = false;
        boolean skipKey = false;
        if (null == campi || campi.isEmpty()) {
            log.debug("Nessun campo ticket presente, validazione non necessaria");
            return;
        }
        for (CampoTicketDTO campo : campi) {
            if (null == campo) {
                continue;
            }
            if (null == campo.getLabel() || campo.getLabel().isBlank()) {
                log.error("Errore nella validazione delle abilitazioni, label del campo ticket nulla");
                errors.add("Errore nella validazione delle abilitazioni, label del campo ticket nulla");
                skipLabel = true;
            }
            if (!skipLabel && campo.getLabel().length() > 255) {
                log.error("Errore nella validazione delle abilitazioni, label del campo ticket troppo lunga");
                errors.add("Errore nella validazione delle abilitazioni, label del campo ticket troppo lunga");
            }
            if (null == campo.getKey() || campo.getKey().isBlank()) {
                log.error("Errore nella validazione delle abilitazioni, key del campo ticket nulla");
                errors.add("Errore nella validazione delle abilitazioni, key del campo ticket nulla");
                skipKey = true;
            }
            if (!skipKey && campo.getKey().length() > 255) {
                log.error("Errore nella validazione delle abilitazioni, key del campo ticket troppo lunga");
                errors.add("Errore nella validazione delle abilitazioni, key del campo ticket troppo lunga");
            }
            skipLabel = false;
            skipKey = false;
        }
    }

    private void validazioneComunicazioni(List<ComunicazioneOnboardingDTO> comunicazioni, List<String> errors) {
        if (null == comunicazioni || comunicazioni.isEmpty()) {
            log.debug("Nessuna comunicazione onboarding presente, validazione non necessaria");
            return;
        }
        for (ComunicazioneOnboardingDTO comunicazione : comunicazioni) {
            if (null == comunicazione) {
                continue;
            }
            // NB: il testo può contenere HTML, quindi niente REGEX_DESCRIZIONI qui
            if (null == comunicazione.getTesto() || comunicazione.getTesto().isBlank()) {
                log.error("Errore nella validazione delle abilitazioni, testo della comunicazione onboarding nullo");
                errors.add("Errore nella validazione delle abilitazioni, testo della comunicazione onboarding nullo");
            }
            if (null != comunicazione.getTypeIcona() && !TIPI_ICONA_AMMESSI.contains(comunicazione.getTypeIcona())) {
                errors.add("Errore nella validazione delle abilitazioni, typeIcona non valido: " + comunicazione.getTypeIcona());
            }
        }
    }

    private void validazioneCruscotto(List<FormStepDTO> formSteps, List<String> errors) {
        try {
            int initialSize = errors.size();
            boolean skipStep = false;
            if (null == formSteps || formSteps.isEmpty()) {
                log.debug("Nessuno step cruscotto presente, validazione non necessaria");
                return;
            }
            for (FormStepDTO formStep : formSteps) {
                if (null == formStep) {
                    log.error("Errore nella validazione del cruscotto, step nullo");
                    errors.add("Errore nella validazione del cruscotto, step nullo");
                    continue;
                }
                if (null == formStep.getStep() || formStep.getStep().isBlank()) {
                    log.error("Errore nella validazione del cruscotto, chiave dello step nulla");
                    errors.add("Errore nella validazione del cruscotto, chiave dello step nulla");
                    skipStep = true;
                }
                if (!skipStep && formStep.getStep().length() > 255) {
                    log.error("Errore nella validazione del cruscotto, chiave dello step troppo lunga");
                    errors.add("Errore nella validazione del cruscotto, chiave dello step troppo lunga");
                }
                if (null != formStep.getDescrizione() && !formStep.getDescrizione().isBlank()) {
                    if (formStep.getDescrizione().length() > 255) {
                        log.error("Errore nella validazione del cruscotto, descrizione dello step troppo lunga");
                        errors.add("Errore nella validazione del cruscotto, descrizione dello step troppo lunga");
                    }
                    if (!formStep.getDescrizione().matches(REGEX_DESCRIZIONI)) {
                        log.error("Errore nella validazione del cruscotto, descrizione dello step non valida");
                        errors.add("Errore nella validazione del cruscotto, descrizione dello step non valida");
                    }
                }
                validazioneSezioniCruscotto(formStep.getSections(), errors);
                skipStep = false;
            }
            if (errors.size() > initialSize) {
                log.error("Errore nella validazione del cruscotto: {}", errors);
            } else {
                log.debug("Validazione del cruscotto completata");
            }
        } catch (Exception exception) {
            log.error("Errore nella validazione del cruscotto: {}", exception.getMessage());
            errors.add("Errore nella validazione del cruscotto");
        }
    }

    private void validazioneSezioniCruscotto(List<SectionDTO> sezioni, List<String> errors) {
        if (null == sezioni || sezioni.isEmpty()) {
            return;
        }
        for (SectionDTO sezione : sezioni) {
            if (null == sezione) {
                continue;
            }
            if (null != sezione.getHeader() && sezione.getHeader().length() > 255) {
                log.error("Errore nella validazione del cruscotto, header della sezione troppo lungo");
                errors.add("Errore nella validazione del cruscotto, header della sezione troppo lungo");
            }
            if (null != sezione.getSubheader() && sezione.getSubheader().length() > 255) {
                log.error("Errore nella validazione del cruscotto, subheader della sezione troppo lungo");
                errors.add("Errore nella validazione del cruscotto, subheader della sezione troppo lungo");
            }
            validazioneCampiCruscotto(sezione.getFields(), errors);
        }
    }

    private void validazioneCampiCruscotto(List<FieldDTO> fields, List<String> errors) {
        boolean skipName = false;
        boolean skipInputType = false;
        if (null == fields || fields.isEmpty()) {
            return;
        }
        for (FieldDTO field : fields) {
            if (null == field) {
                continue;
            }
            if (null == field.getName() || field.getName().isBlank()) {
                log.error("Errore nella validazione del cruscotto, name del campo nullo");
                errors.add("Errore nella validazione del cruscotto, name del campo nullo");
                skipName = true;
            }
            if (!skipName && field.getName().length() > 255) {
                log.error("Errore nella validazione del cruscotto, name del campo troppo lungo");
                errors.add("Errore nella validazione del cruscotto, name del campo troppo lungo");
            }
            if (null == field.getInputType() || field.getInputType().isBlank()) {
                log.error("Errore nella validazione del cruscotto, inputType del campo nullo");
                errors.add("Errore nella validazione del cruscotto, inputType del campo nullo");
                skipInputType = true;
            }
            if (!skipInputType && field.getInputType().length() > 255) {
                log.error("Errore nella validazione del cruscotto, inputType del campo troppo lungo");
                errors.add("Errore nella validazione del cruscotto, inputType del campo troppo lungo");
            }
            // validazione ricorsiva dei campi figli (children)
            validazioneCampiCruscotto(field.getChildren(), errors);
            skipName = false;
            skipInputType = false;
        }
    }
}
