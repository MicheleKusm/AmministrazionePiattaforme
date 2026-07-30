package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sogei.acrgs.platformms.dto.*;
import it.sogei.acrgs.platformms.entity.Piattaforma;
import it.sogei.acrgs.platformms.entity.PiattaformaRefProcess;
import it.sogei.acrgs.platformms.entity.Ruolo;
import it.sogei.acrgs.platformms.repository.PiattaformaRefProcessRepository;
import it.sogei.acrgs.platformms.repository.PiattaformaRepository;
import it.sogei.acrgs.platformms.repository.TipologicaCampoDinamicoRepository;
import it.sogei.acrgs.platformms.repository.UtilityToolRepository;
import it.sogei.acrgs.platformms.utils.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static it.sogei.acrgs.platformms.utils.Constants.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AbilitazioneService {

    private final UtilityToolRepository utilityToolRepository;
    private final PiattaformaRefProcessRepository refProcessRepository;
    private final TipologicaCampoDinamicoRepository tipologicaRepository;
    private final PiattaformaRepository piattaformaRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<AbilitazioneDTO> listByPiattaforma(Long idPiattaforma) {
        Piattaforma piattaforma = piattaformaRepository.findById(idPiattaforma).orElseThrow();
        return refProcessRepository.findByIdPiattaforma_Id(idPiattaforma).stream()
                .map(ref -> toDto(ref, piattaforma))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TipologicaCampoDTO> listTipologiche() {
        return tipologicaRepository.findAll().stream()
                .map(t -> TipologicaCampoDTO.builder()
                        .tipoDati(t.getTipoDati())
                        .type(t.getType())
                        .regex(t.getRegex())
                        .idTipoDati(t.getIdTipoDati())
                        .apiSource(t.getApiSource())
                        .label(t.getLabel())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UtilityToolDTO> listIcone() {
        return utilityToolRepository.findByType(ICONA)
                .stream()
                .peek(t -> validateIconeSvg(t.getAdditionalInfo()))
                .map(t -> UtilityToolDTO.builder()
                        .name(t.getName())
                        .type(t.getType())
                        .additionalInfo(t.getAdditionalInfo())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> listProcessiVerticali() {
        return refProcessRepository.findDistinctProcessKeys(PROCESS_KEY_TICKET);
    }

    @Transactional
    public AbilitazioneDTO create(AbilitazioneDTO dto) {
        Piattaforma piattaforma = piattaformaRepository.findById(dto.getIdPiattaforma()).orElseThrow();
        PiattaformaRefProcess ref = new PiattaformaRefProcess();
        ref.setIdPiattaforma(piattaforma);
        applyDto(ref, piattaforma, dto);
        ref = refProcessRepository.save(ref);
        return toDto(ref, piattaforma);
    }

    @Transactional
    public AbilitazioneDTO update(Long id, AbilitazioneDTO dto) {
        PiattaformaRefProcess ref = refProcessRepository.findById(id).orElseThrow();
        Piattaforma piattaforma = ref.getIdPiattaforma();
        applyDto(ref, piattaforma, dto);
        ref = refProcessRepository.save(ref);
        return toDto(ref, piattaforma);
    }

    @Transactional
    public void delete(Long id) {
        PiattaformaRefProcess ref = refProcessRepository.findById(id).orElseThrow();
        refProcessRepository.delete(ref);
    }/*
     */
    // ---------- scrittura ----------

    private void applyDto(PiattaformaRefProcess ref, Piattaforma piattaforma, AbilitazioneDTO dto) {
        boolean ticket = TIPO_TICKET.equalsIgnoreCase(dto.getTipo());
        String processKey = ticket ? PROCESS_KEY_TICKET : nullToEmpty(dto.getProcessoVerticale());
        ref.setIdPiattaforma(piattaforma);
        ref.setProcessKey(processKey);
        ref.setScimCode(ticket ? nullToEmpty(dto.getCodiceScim()) : null);
        ref.setProcessVars(buildProcessVars(dto));
        Ruolo ruolo = new Ruolo();
        ruolo.setId(dto.getIdRuolo());
        ref.setIdRuolo(dto.getIdRuolo() != null ? ruolo : null);
    }

    private String buildProcessVars(AbilitazioneDTO dto) {
        ProcessVarDTO processVarDTO = new ProcessVarDTO(dto.getCampi(), dto.getComunicazioni());
        assegnaIdMancanti(processVarDTO);
        Utility.mergeIcona(processVarDTO.getOnboarding());
        try {
            return this.objectMapper.writeValueAsString(processVarDTO);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("PROCESS_VARS non serializzabile", ex);
        }
    }

    // ---------- lettura ----------

    private AbilitazioneDTO toDto(PiattaformaRefProcess ref, Piattaforma piattaforma) {
        boolean ticket = PROCESS_KEY_TICKET.equalsIgnoreCase(ref.getProcessKey());
        String tipo = ticket ? TIPO_TICKET : TIPO_VERTICALE;
        ProcessVarDTO processVarDTO = readProcessVars(ref.getProcessVars());

        String riferimento = ticket ? nullToEmpty(ref.getScimCode()) : nullToEmpty(ref.getProcessKey());
        return AbilitazioneDTO.builder()
                .id(ref.getId())
                .idPiattaforma(piattaforma.getId())
                .nome(buildNome(ticket, piattaforma.getNome(), ref.getProcessKey()))
                .tipo(tipo)
                .riferimento(riferimento)
                .stato(STATO_ATTIVA)
                .processKey(ref.getProcessKey())
                .codiceScim(ticket ? nullToEmpty(ref.getScimCode()) : "")
                .processoVerticale(ticket ? "" : nullToEmpty(ref.getProcessKey()))
                .campi(processVarDTO.getInputs())
                .comunicazioni(processVarDTO.getOnboarding())
                .idRuolo(ref.getIdRuolo() != null ? ref.getIdRuolo().getId() : null)
                .build();
    }

    private ProcessVarDTO readProcessVars(String s) {
        if (s == null || s.isBlank()) {
            return new ProcessVarDTO();
        }
        try {
            ProcessVarDTO processVarDTO = this.objectMapper.readValue(s, ProcessVarDTO.class);
            assegnaIdMancanti(processVarDTO);
            processVarDTO.getOnboarding().forEach(comunicazione -> {
                if (comunicazione.getIcona() != null && !comunicazione.getIcona().isBlank()) {
                    String[] parts = comunicazione.getIcona().split(SEP_ICONA, 2);
                    comunicazione.setIcona(parts[0]);
                    comunicazione.setTypeIcona(parts.length > 1 ? parts[1] : "");
                }
            });
            return processVarDTO;
        } catch (JsonProcessingException e) {
            log.error("Errore nel parsing di processVars: {}", s, e);
            throw new RuntimeException(e);
        }
    }

    // ---------- utils ----------

    private String buildNome(boolean ticket, String nomePiattaforma, String processKey) {
        if (ticket) {
            return ("Abilitazione ticket " + nullToEmpty(nomePiattaforma)).trim();
        }
        return ("Processo " + toTitleCase(processKey)).trim();
    }

    private String toTitleCase(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        String[] parti = value.trim().toLowerCase().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String parte : parti) {
            if (parte.isEmpty()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(Character.toUpperCase(parte.charAt(0))).append(parte.substring(1));
        }
        return sb.toString();
    }

    private void assegnaIdMancanti(ProcessVarDTO processVarDTO) {
        if (processVarDTO == null) {
            return;
        }
        assegnaIdCampi(processVarDTO.getInputs());
        assegnaIdComunicazioni(processVarDTO.getOnboarding());
    }

    private void assegnaIdCampi(List<CampoTicketDTO> campi) {
        if (campi == null || campi.isEmpty()) {
            return;
        }
        long maxId = 0L;
        for (CampoTicketDTO campo : campi) {
            if (campo.getId() != null && campo.getId() > maxId) {
                maxId = campo.getId();
            }
        }
        for (CampoTicketDTO campo : campi) {
            if (campo.getId() == null) {
                campo.setId(++maxId);
            }
        }
    }

    private void assegnaIdComunicazioni(List<ComunicazioneOnboardingDTO> comunicazioni) {
        if (comunicazioni == null || comunicazioni.isEmpty()) {
            return;
        }
        long maxId = 0L;
        for (ComunicazioneOnboardingDTO comunicazione : comunicazioni) {
            if (comunicazione.getId() != null && comunicazione.getId() > maxId) {
                maxId = comunicazione.getId();
            }
        }
        for (ComunicazioneOnboardingDTO comunicazione : comunicazioni) {
            if (comunicazione.getId() == null) {
                comunicazione.setId(++maxId);
            }
        }
    }

    private void validateIconeSvg(String additionalInfo) {
        if (additionalInfo == null) return;
        boolean found = DANGEROUS_TAGS.stream().anyMatch(additionalInfo::contains);
        if (found) {
            log.error("La colonna additionalInfo contiene tag non consentite: {}", additionalInfo);
            throw new IllegalArgumentException("La colonna additionalInfo contiene tag non consentite.");
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
