package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.*;
import it.sogei.acrgs.platformms.repository.RuoliRefAppartenenzaRepository;
import it.sogei.acrgs.platformms.utils.Validation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersistenceService {
    private final PiattaformaService piattaformaService;
    private final RuoloService ruoloService;
    private final GruppoAppartenenzaService gruppoService;
    private final AbilitazioneService abilitazioneService;
    private final RuoliRefAppartenenzaRepository refRepository;

    @Transactional(rollbackFor = Exception.class)
    public List<String> persist(PersistenceObjectDTO persistenceObjectDTO) {
        List<String> errors = new ArrayList<>();
        new Validation().validazionePersistenceObject(persistenceObjectDTO, errors);
        if (!errors.isEmpty()) {
            log.debug("Errore nella validazione dei dati: {}, operazione interrotta", errors);
            return errors;
        }
        validateDbConstraints(persistenceObjectDTO, errors);
        if (!errors.isEmpty()) {
            log.debug("Errore nella validazione dati a DB: {}, operazione interrotta", errors);
            return errors;
        }
        try {
            Long idPiattaforma = persistPiattaforma(persistenceObjectDTO.getPiattaforma());
            Map<Long, Long> roleIdMap = persistRuoli(persistenceObjectDTO.getRuoli(), idPiattaforma);
            persistGruppi(persistenceObjectDTO.getGruppiAppartenenza(), roleIdMap);
            persistAbilitazioni(persistenceObjectDTO.getAbilitazioni(), idPiattaforma, roleIdMap);
            deleteRuoli(persistenceObjectDTO.getRuoli());
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

    private Map<Long, Long> persistRuoli(List<RuoloDTO> ruoli, Long idPiattaforma) {
        Map<Long, Long> idMap = new HashMap<>();
        if (null == ruoli || ruoli.isEmpty()) {
            log.debug("Nessun ruolo presente, persistenza non necessaria");
            return idMap;
        }
        for (RuoloDTO ruolo : ruoli) {
            if (ruolo.isDaEliminare() && null != ruolo.getId() && ruolo.getId() > 0) {
                continue;
            }
            if (null != ruolo.getId() && ruolo.getId() > 0) {
                ruolo.setIdPiattaforma(idPiattaforma);
                ruoloService.update(ruolo.getId(), ruolo);
                log.info("Ruolo aggiornato: {}", ruolo.getId());
            } else {
                Long tempId = ruolo.getId();
                ruolo.setIdPiattaforma(idPiattaforma);
                ruolo.setId(null);
                RuoloDTO created = ruoloService.create(ruolo);
                log.info("Ruolo creato con id: {}", created.getId());
                if (null != tempId && tempId < 0) {
                    idMap.put(tempId, created.getId());
                }
            }
        }
        return idMap;
    }

    private void persistGruppi(List<GruppoAppartenenzaDTO> gruppi, Map<Long, Long> roleIdMap) {
        if (null == gruppi || gruppi.isEmpty()) {
            log.debug("Nessun gruppoAppartenenza presente, persistenza non necessaria");
            return;
        }
        for (GruppoAppartenenzaDTO gruppo : gruppi) {
            // rimpiazziamo id temporanei
            if (null != gruppo.getRuoliIds() && !gruppo.getRuoliIds().isEmpty()) {
                List<Long> updatedIds = new ArrayList<>();
                for (Long id : gruppo.getRuoliIds()) {
                    if (null != id && id < 0) {
                        Long realId = roleIdMap.get(id);
                        updatedIds.add(realId != null ? realId : id);
                    } else {
                        updatedIds.add(id);
                    }
                }
                gruppo.setRuoliIds(updatedIds);
            }
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

    private void persistAbilitazioni(List<AbilitazioneDTO> abilitazioni, Long idPiattaforma, Map<Long, Long> roleIdMap) {
        if (null == abilitazioni || abilitazioni.isEmpty()) {
            log.debug("Nessuna abilitazione presente, persistenza non necessaria");
            return;
        }
        for (AbilitazioneDTO abilitazione : abilitazioni) {
            if (null != abilitazione.getIdRuolo() && abilitazione.getIdRuolo() < 0) {
                Long realId = roleIdMap.get(abilitazione.getIdRuolo());
                abilitazione.setIdRuolo(realId != null ? realId : abilitazione.getIdRuolo());
            }
            if (abilitazione.isDaEliminare()) {
                if (null != abilitazione.getId() && abilitazione.getId() > 0) {
                    abilitazioneService.delete(abilitazione.getId());
                    log.info("Abilitazione eliminata: {}", abilitazione.getId());
                } else {
                    log.debug("Abilitazione nuova marcata daEliminare, nessuna azione");
                }
            } else if (null != abilitazione.getId() && abilitazione.getId() > 0) {
                abilitazione.setIdPiattaforma(idPiattaforma);
                abilitazioneService.update(abilitazione.getId(), abilitazione);
                log.info("Abilitazione aggiornata: {}", abilitazione.getId());
            } else {
                abilitazione.setIdPiattaforma(idPiattaforma);
                abilitazione.setId(null);
                AbilitazioneDTO created = abilitazioneService.create(abilitazione);
                log.info("Abilitazione creata con id: {}", created.getId());
            }
        }
    }

    /**
     * elima ruoli marcati daEliminare se presenti, altrimenti non fa nulla
     **/
    private void deleteRuoli(List<RuoloDTO> ruoli) {
        if (null == ruoli || ruoli.isEmpty()) {
            return;
        }
        for (RuoloDTO ruolo : ruoli) {
            if (ruolo.isDaEliminare() && null != ruolo.getId() && ruolo.getId() > 0) {
                refRepository.deleteByIdIdRuolo(ruolo.getId());
                ruoloService.delete(ruolo.getId());
                log.info("Ruolo eliminato (dopo gruppi e pulizia bridge): {}", ruolo.getId());
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
                // gruppi check constraint nella bridge table
                if (null != dto.getGruppiAppartenenza() && !dto.getGruppiAppartenenza().isEmpty()) {
                    for (GruppoAppartenenzaDTO gruppo : dto.getGruppiAppartenenza()) {
                        if (gruppo.isDaEliminare() || null == gruppo.getRuoliIds() || gruppo.getRuoliIds().isEmpty())
                            continue;
                        if (null == gruppo.getId() || gruppo.getId() < 0) {
                            Set<Long> seen = new HashSet<>();
                            for (Long idRuolo : gruppo.getRuoliIds()) {
                                if (null == idRuolo) continue;
                                if (!seen.add(idRuolo)) {
                                    errors.add("Ruolo duplicato all'interno del gruppo: " + gruppo.getNome());
                                }
                            }
                        }
                    }
                }
            }
            validateAbilitazioniSingleTipo(dto.getAbilitazioni(), errors);
            if (errors.size() > initialSize) {
                log.error("Errore nella validazione a DB: {}", errors);
            } else {
                log.debug("Validazione a DB completata");
            }
        } catch (Exception exception) {
            log.error("Errore durante la validazione a DB: {}", exception.getMessage());
            errors.add("Errore generico durante la validazione a DB");
        }
    }

    private void validateAbilitazioniSingleTipo(List<AbilitazioneDTO> abilitazioni, List<String> errors) {
        if (null == abilitazioni || abilitazioni.isEmpty()) {
            return;
        }
        String tipoComune = null;
        for (AbilitazioneDTO abilitazione : abilitazioni) {
            if (abilitazione.isDaEliminare() || null == abilitazione.getTipo() || abilitazione.getTipo().isBlank()) {
                continue;
            }
            if (null == tipoComune) {
                tipoComune = abilitazione.getTipo();
            } else if (!tipoComune.equalsIgnoreCase(abilitazione.getTipo())) {
                errors.add("Le abilitazioni della piattaforma devono essere tutte dello stesso tipo (TICKET o VERTICALE).");
                break;
            }
        }
    }
}
