package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sogei.acrgs.platformms.dto.PiattaformaDTO;
import it.sogei.acrgs.platformms.entity.Piattaforma;
import it.sogei.acrgs.platformms.repository.PiattaformaRepository;
import it.sogei.acrgs.platformms.utils.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static it.sogei.acrgs.platformms.utils.Constants.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PiattaformaService {

    private final PiattaformaRepository piattaformaRepository;
    private final ObjectMapper objectMapper;

    public List<PiattaformaDTO> listAll() {
        return piattaformaRepository.findAll().stream().map(this::toDto).toList();
    }

    public Page<PiattaformaDTO> list(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Piattaforma> piattaforme = (search == null || search.isBlank())
                ? piattaformaRepository.findAll(pageable)
                : piattaformaRepository.findByNomeContainingIgnoreCase(search.trim(), pageable);
        return piattaforme.map(this::toDto);
    }

    public List<String> validaPiattaformaNomeAndObjclass(PiattaformaDTO dto) {
        List<String> errors = new ArrayList<>();
        validazioneNomeDescObjclass(dto, errors);
        return errors;
    }

    @Transactional(readOnly = true)
    public PiattaformaDTO get(Long id) {
        return toDto(piattaformaRepository.findById(id).orElseThrow());
    }

    @Transactional
    public PiattaformaDTO create(PiattaformaDTO dto) {
        Piattaforma entity = new Piattaforma();
        applyDto(entity, dto);
        return toDto(piattaformaRepository.save(entity));
    }

    @Transactional
    public PiattaformaDTO update(Long id, PiattaformaDTO dto) {
        Piattaforma entity = piattaformaRepository.findById(id).orElseThrow();
        applyDto(entity, dto);
        return toDto(piattaformaRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        piattaformaRepository.deleteById(id);
    }

    private void applyDto(Piattaforma entity, PiattaformaDTO dto) {
        entity.setNome(dto.getNome());
        entity.setDescrizione(dto.getDescrizione());
        entity.setUrl(dto.getUrl());
        entity.setCanale(dto.getCanale());
        entity.setObjClass(dto.getObjClass());
        entity.setReadOnly(Boolean.TRUE.equals(dto.getReadOnly()) ? 1 : 0);
        entity.setConfigJson(toConfigJson(dto));
    }

    private PiattaformaDTO toDto(Piattaforma entity) {
        Utility utility = new Utility();
        Map<String, Object> config = parseConfig(entity.getConfigJson());
        return PiattaformaDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .descrizione(entity.getDescrizione())
                .url(entity.getUrl())
                .canale(entity.getCanale())
                .objClass(entity.getObjClass())
                .readOnly(entity.getReadOnly() != null && entity.getReadOnly() == 1)
                .codiceIct(entity.getCodiceIct())
                .oamMetadataName(extractOamMetadata(config, OAM_METADATA_NAME))
                .oamMetadataValue(extractOamMetadata(config, OAM_METADATA_VALUE))
                .richiedibileDaCruscotto(utility.convertToBoolean(entity.getRichiedibileDaCruscotto()))
                .richiedibileInCorso(utility.convertToBoolean(entity.getRichiedibileInCorso()))
                .ripetibile(utility.convertToBoolean(entity.getRipetibile()))
                .utilizzoModelloAutorizzativo(utility.convertToBoolean(entity.getUtilizzoModelloAutorizzativo()))
                .build();
    }

    private String toConfigJson(PiattaformaDTO dto) {
        Map<String, Object> config = new LinkedHashMap<>();
        config.put(CODICE_ICT, dto.getCodiceIct());
        config.put(OAMMETADATANAME, dto.getOamMetadataName());
        config.put(OAMMETADATAVALUE, dto.getOamMetadataValue());
        config.put(RICHIEDIBILE_DA_CRUSCOTTO, dto.getRichiedibileDaCruscotto());
        config.put(RICHIEDIBILE_IN_CORSO, dto.getRichiedibileInCorso());
        config.put(RIPETIBILE, dto.getRipetibile());
        config.put(UTILIZZO_MODELLO_AUTORIZZATIVO, dto.getUtilizzoModelloAutorizzativo());
        try {
            return objectMapper.writeValueAsString(config);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("CONFIG_JSON non serializzabile", ex);
        }
    }

    private Map<String, Object> parseConfig(String configJson) {
        if (null == configJson || configJson.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(configJson, new TypeReference<>() {});
        } catch (JsonProcessingException ex) {
            log.error("CONFIG_JSON non valido: {}", configJson, ex);
            return Map.of();
        }
    }

    private String extractOamMetadata(Map<String, Object> config, String metadataField) {
        if (null == config) return null;
        Object oamObj = config.get(OAM_METADATA);
        if (oamObj instanceof Map<?, ?> oamMap) {
            Object value = oamMap.get(metadataField);
            return value instanceof String ? (String) value : null;
        }
        return null;
    }

    private void validazioneNomeDescObjclass (PiattaformaDTO dto, List<String> errors) {
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
            if (null != dto.getNome() && null != dto.getObjClass() && piattaformaRepository.countByNomeOrObjClassExcludeId(dto.getNome(), dto.getObjClass(), dto.getId()) > 0) {
                log.debug("Validazione piattaforma fallita: Nome e Obj_class devono essere univoci");
                errors.add("Nome e Obj_class devono essere univoci");
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
