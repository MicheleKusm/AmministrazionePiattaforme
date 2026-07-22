package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sogei.acrgs.platformms.dto.GruppoAppartenenzaDTO;
import it.sogei.acrgs.platformms.dto.GruppoDependenciesDTO;
import it.sogei.acrgs.platformms.entity.*;
import it.sogei.acrgs.platformms.repository.GruppoAppartenenzaRepository;
import it.sogei.acrgs.platformms.repository.PiattaformaRepository;
import it.sogei.acrgs.platformms.repository.RuoliRefAppartenenzaRepository;
import it.sogei.acrgs.platformms.repository.RuoloRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GruppoAppartenenzaService {

    private final GruppoAppartenenzaRepository gruppoRepository;
    private final RuoliRefAppartenenzaRepository refRepository;
    private final PiattaformaRepository piattaformaRepository;
    private final RuoloRepository ruoloRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<GruppoAppartenenzaDTO> list() {
        return gruppoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public GruppoAppartenenzaDTO create(GruppoAppartenenzaDTO dto) {
        GruppoAppartenenza gruppo = new GruppoAppartenenza();
        gruppo.setCategoria(dto.getNome());
        gruppo.setDescrizione(dto.getDescrizione());
        GruppoAppartenenza saved = gruppoRepository.save(gruppo);
        saveRefs(saved.getId(), dto.getRuoliIds());
        return toDto(saved);
    }

    @Transactional
    public GruppoAppartenenzaDTO update(Long id, GruppoAppartenenzaDTO dto) {
        GruppoAppartenenza gruppo = gruppoRepository.findById(id).orElseThrow();
        gruppo.setCategoria(dto.getNome());
        gruppo.setDescrizione(dto.getDescrizione());
        GruppoAppartenenza saved = gruppoRepository.save(gruppo);
        refRepository.deleteByIdIdGruppoAppartenenza(id);
        saveRefs(id, dto.getRuoliIds());
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        refRepository.deleteByIdIdGruppoAppartenenza(id);
        gruppoRepository.deleteById(id);
    }

    private void saveRefs(Long gruppoId, List<Long> ruoliIds) {
        if (ruoliIds == null) {
            return;
        }
        for (Long ruoloId : ruoliIds) {
            RuoliRefAppartenenza ref = new RuoliRefAppartenenza();
            RuoliRefAppartenenzaId refId = new RuoliRefAppartenenzaId();
            refId.setIdGruppoAppartenenza(gruppoId);
            refId.setIdRuolo(ruoloId);
            ref.setId(refId);
            refRepository.save(ref);
        }
    }

    private GruppoAppartenenzaDTO toDto(GruppoAppartenenza entity) {
        List<Long> ruoliIds = refRepository.findByIdIdGruppoAppartenenza(entity.getId())
                .stream()
                .map(ref -> ref.getId().getIdRuolo())
                .toList();
        return GruppoAppartenenzaDTO.builder()
                .id(entity.getId())
                .nome(entity.getCategoria())
                .descrizione(entity.getDescrizione())
                .ruoliIds(ruoliIds)
                .build();
    }

    @Transactional(readOnly = true)
    public GruppoDependenciesDTO getDependencies(Long gruppoId) {
        List<GruppoDependenciesDTO.Dependency> deps = new ArrayList<>();

        List<Piattaforma> allPiattaforme = piattaformaRepository.findAll();
        for (Piattaforma p : allPiattaforme) {
            String configJson = p.getConfigJson();
            if (configJson != null && !configJson.isBlank()) {
                try {
                    JsonNode root = objectMapper.readTree(configJson);
                    List<Long> referencedGroupIds = extractRoleGroups(root);
                    if (referencedGroupIds.contains(gruppoId)) {
                        deps.add(GruppoDependenciesDTO.Dependency.builder()
                                .type("PIATTAFORMA")
                                .name(p.getNome())
                                .id(p.getId())
                                .build());
                    }
                } catch (JsonProcessingException e) {
                    log.error("Error parsing config_json for piattaforma {}: {}", p.getId(), e.getMessage());
                }
            }
        }
        List<Ruolo> ruoli = ruoloRepository.findByGruppoAppartenenzaId(gruppoId);
        for (Ruolo r : ruoli) {
            deps.add(GruppoDependenciesDTO.Dependency.builder()
                    .type("RUOLO")
                    .name(r.getNome())
                    .id(r.getId())
                    .build());
        }

        return GruppoDependenciesDTO.builder().dependencies(deps).build();
    }

    private List<Long> extractRoleGroups(JsonNode node) {
        List<Long> result = new ArrayList<>();
        if (node.isArray()) {
            for (JsonNode item : node) {
                result.addAll(extractRoleGroups(item));
            }
        } else if (node.isObject()) {
            if (node.has("role_groups") && node.get("role_groups").isArray()) {
                for (JsonNode groupIdNode : node.get("role_groups")) {
                    if (groupIdNode.isNumber()) {
                        result.add(groupIdNode.longValue());
                    }
                }
            }
            node.fields().forEachRemaining(entry -> {
                result.addAll(extractRoleGroups(entry.getValue()));
            });
        }
        return result;
    }
}
