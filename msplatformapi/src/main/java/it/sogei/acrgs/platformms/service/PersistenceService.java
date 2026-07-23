package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.GruppoAppartenenzaDTO;
import it.sogei.acrgs.platformms.dto.PersistenceObjectDTO;
import it.sogei.acrgs.platformms.dto.PiattaformaDTO;
import it.sogei.acrgs.platformms.dto.RuoloDTO;
import it.sogei.acrgs.platformms.utils.Validation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersistenceService {
    private final PiattaformaService piattaformaService;
    private final RuoloService ruoloService;
    private final GruppoAppartenenzaService gruppoService;

    @Transactional(rollbackFor = Exception.class)
    public List<String> persist (PersistenceObjectDTO persistenceObjectDTO) {
        List<String> errors = new ArrayList<>();
        new Validation().validazionePersistenceObject(persistenceObjectDTO, errors);
        if (!errors.isEmpty()) {
            log.debug("Errore nella validazione dei dati: {}", errors);
            return errors;
        }
        validateDbConstraints(persistenceObjectDTO, errors);
        if (!errors.isEmpty()) {
            log.debug("Errore nella validazione dati a DB: {}", errors);
        }
        try {
            Long idPiattaforma = persistPiattaforma(persistenceObjectDTO.getPiattaforma());
            persistRuoli(persistenceObjectDTO.getRuoli(), idPiattaforma);
            persistGruppi(persistenceObjectDTO.getGruppiAppartenenza(), idPiattaforma);
            log.info("Persistenza effettuata con successo, idPiattaforma: {}.", idPiattaforma);
        } catch (Exception e) {
            log.error("Errore durante il salvataggio: {}", e.getMessage(), e);
            errors.add("Errore durante il salvataggio: " + e.getMessage());
            throw new RuntimeException("Errore durante il salvataggio, eseguo rollback", e);
        }
        return errors;
    }

    private Long persistPiattaforma(PiattaformaDTO piattaforma) {
        if (null != piattaforma.getId() && piattaforma.getId() > 0) {
            PiattaformaDTO updated = piattaformaService.update(piattaforma.getId(), piattaforma);
            log.info("Piattaforma aggiornata con id: {}", updated.getId());
            return updated.getId();
        } else {
            piattaforma.setId(null);
            PiattaformaDTO created = piattaformaService.create(piattaforma);
            log.info("Piattaforma creata con id: {}", created.getId());
            return created.getId();
        }
    }

    private void persistRuoli(List<RuoloDTO> ruoli, Long idPiattaforma) {
        if (null == ruoli || ruoli.isEmpty()) {
            log.debug("Nessun ruolo presente, persistenza non necessaria");
        } else {
            for (RuoloDTO ruolo : ruoli) {
                if (ruolo.isDaEliminare() && null != ruolo.getId() && ruolo.getId() > 0) {
                    ruoloService.delete(ruolo.getId());
                    log.info("Ruolo eliminato: {}", ruolo.getId());
                } else if (null != ruolo.getId() && ruolo.getId() > 0) {
                    ruolo.setIdPiattaforma(idPiattaforma);
                    ruoloService.update(ruolo.getId(), ruolo);
                    log.info("Ruolo aggiornato: {}", ruolo.getId());
                } else {
                    ruolo.setIdPiattaforma(idPiattaforma);
                    ruolo.setId(null);
                    RuoloDTO created = ruoloService.create(ruolo);
                    log.info("Ruolo creato con id: {}", created.getId());
                }
            }
        }
    }

    private void persistGruppi(List<GruppoAppartenenzaDTO> gruppi, Long idPiattaforma) {
        if (null == gruppi || gruppi.isEmpty()) {
            log.debug("Nessun gruppoAppartenenza presente, persistenza non necessaria");
        } else {
            for (GruppoAppartenenzaDTO gruppo : gruppi) {
                if (gruppo.isDaEliminare() && null != gruppo.getId() && gruppo.getId() > 0) {
                    gruppoService.delete(gruppo.getId());
                    log.info("Gruppo eliminato: {}", gruppo.getId());
                } else if (null != gruppo.getId() && gruppo.getId() > 0) {
                    gruppoService.update(gruppo.getId(), gruppo);
                    log.info("Gruppo aggiornato: {}", gruppo.getId());
                } else {
                    gruppo.setId(null);
                    GruppoAppartenenzaDTO created = gruppoService.create(gruppo);
                    log.info("Gruppo creato con id: {}", created.getId());
                }
            }
        }
    }

    private void validateDbConstraints(PersistenceObjectDTO dto, List<String> errors) {
        log.debug("Validazione a DB, INIZIO");
        int initialSize = errors.size();
        try {
            // piattaforma, nome e objclass unici
            PiattaformaDTO piattaforma = dto.getPiattaforma();
            if (null != piattaforma) {
                List<String> platformErrors = piattaformaService.validaPiattaformaNomeAndObjclass(piattaforma);
                if (null != platformErrors && !platformErrors.isEmpty()) {
                    log.error("Errore nella validazione a DB della piattaforma: {}", platformErrors);
                    errors.addAll(platformErrors);
                }
            }
            // id > 0 -> update
            Long idPiattaforma = (null != piattaforma && null != piattaforma.getId() && piattaforma.getId() > 0) ? piattaforma.getId() : null;
            // ruoli check duplicati in dto
            if (null != dto.getRuoli() && !dto.getRuoli().isEmpty()) {
                Set<String> nomiPresenti = new HashSet<>();
                for (RuoloDTO ruolo : dto.getRuoli()) {
                    if (ruolo.isDaEliminare() || null == ruolo.getNome()) continue;
                    if (!nomiPresenti.add(ruolo.getNome())) {
                        errors.add("Ruolo con nome duplicato all'interno della lista: " + ruolo.getNome());
                    }
                }
                // ruoli check duplicati in db se siamo in update
                if (null != idPiattaforma) {
                    for (RuoloDTO ruolo : dto.getRuoli()) {
                        if (ruolo.isDaEliminare() || null == ruolo.getNome()) continue;
                        Long excludeId = (null != ruolo.getId() && ruolo.getId() > 0) ? ruolo.getId() : null;
                        if (ruoloService.existsByNomeAndPiattaformaExcludingId(ruolo.getNome(), idPiattaforma, excludeId)) {
                            errors.add("Ruolo con nome '" + ruolo.getNome() + "' già esistente per questa piattaforma.");
                        }
                    }
                }
                // gruppi check duplicati in db
                if (null != dto.getGruppiAppartenenza() && !dto.getGruppiAppartenenza().isEmpty()) {
                    for (GruppoAppartenenzaDTO gruppo : dto.getGruppiAppartenenza()) {
                        if (gruppo.isDaEliminare() || null == gruppo.getNome()) continue;
                        Long excludeId = (null != gruppo.getId() && gruppo.getId() > 0) ? gruppo.getId() : null;
                        if (gruppoService.existsByNomeExcludingId(gruppo.getNome(), excludeId)) {
                            errors.add("Gruppo con nome '" + gruppo.getNome() + "' già esistente.");
                        }
                    }
                }
                // gruppi check constraint in bridge table
                if (null != dto.getGruppiAppartenenza() && !dto.getGruppiAppartenenza().isEmpty()) {
                    for (GruppoAppartenenzaDTO gruppo : dto.getGruppiAppartenenza()) {
                        if (gruppo.isDaEliminare() || null == gruppo.getId() || gruppo.getId() <= 0) continue;
                        if (null != gruppo.getRuoliIds() && !gruppo.getRuoliIds().isEmpty()) {
                            for (Long idRuolo : gruppo.getRuoliIds()) {
                                if (null == idRuolo) continue;
                                if (gruppoService.existsBridgeByRuoloAndGruppo(idRuolo, gruppo.getId())) {
                                    errors.add("Associazione ruolo-gruppo già esistente: ruolo " + idRuolo + " - gruppo " + gruppo.getId());
                                }
                            }
                        }
                    }
                }
                if (errors.size() > initialSize) {
                    log.error("Errore nella validazione a DB: {}", errors);
                } else {
                    log.debug("Validazione a DB completata");
                }
            }
        } catch (Exception exception) {
            log.error("Errore durante la validazione a DB: {}", exception.getMessage());
            errors.add("Errore generico durante la validazione a DB");
        }
    }
}
