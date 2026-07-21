package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sogei.acrgs.platformms.dto.PiattaformaDTO;
import it.sogei.acrgs.platformms.entity.Piattaforma;
import it.sogei.acrgs.platformms.repository.PiattaformaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PiattaformaService {

    private final PiattaformaRepository piattaformaRepository;
    private final ObjectMapper objectMapper;

    public Page<PiattaformaDTO> list(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Piattaforma> piattaforme = (search == null || search.isBlank())
                ? piattaformaRepository.findAll(pageable)
                : piattaformaRepository.findByNomeContainingIgnoreCase(search.trim(), pageable);
        return piattaforme.map(this::toDto);
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
        Map<String, Object> config = parseConfig(entity.getConfigJson());
        return PiattaformaDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .descrizione(entity.getDescrizione())
                .url(entity.getUrl())
                .canale(entity.getCanale())
                .objClass(entity.getObjClass())
                .readOnly(entity.getReadOnly() != null && entity.getReadOnly() == 1)
                .codiceIct(readString(config, "codiceIct"))
                .oamMetadataName(readString(config, "oamMetadataName"))
                .oamMetadataValue(readString(config, "oamMetadataValue"))
                .richiedibileDaCruscotto(readBoolean(config, "richiedibileDaCruscotto"))
                .richiedibileInCorso(readBoolean(config, "richiedibileInCorso"))
                .ripetibile(readBoolean(config, "ripetibile"))
                .utilizzoModelloAutorizzativo(readBoolean(config, "utilizzoModelloAutorizzativo"))
                .build();
    }

    private String toConfigJson(PiattaformaDTO dto) {
        Map<String, Object> config = new LinkedHashMap<>();
        config.put("codiceIct", dto.getCodiceIct());
        config.put("oamMetadataName", dto.getOamMetadataName());
        config.put("oamMetadataValue", dto.getOamMetadataValue());
        config.put("richiedibileDaCruscotto", dto.getRichiedibileDaCruscotto());
        config.put("richiedibileInCorso", dto.getRichiedibileInCorso());
        config.put("ripetibile", dto.getRipetibile());
        config.put("utilizzoModelloAutorizzativo", dto.getUtilizzoModelloAutorizzativo());
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
    //TODO solo per oam metadata name e value
    private String readString(Map<String, Object> config, String key) {
        Object value = config.get(key);
        return value instanceof String ? (String) value : null;
    }

    private Boolean readBoolean(Map<String, Object> config, String key) {
        Object value = config.get(key);
        return value instanceof Boolean ? (Boolean) value : null;
    }
}
