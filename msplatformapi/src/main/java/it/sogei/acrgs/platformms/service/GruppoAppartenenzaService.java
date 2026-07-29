package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sogei.acrgs.platformms.dto.FormStepDTO;
import it.sogei.acrgs.platformms.dto.GruppoAppartenenzaDTO;
import it.sogei.acrgs.platformms.dto.GruppoDependenciesDTO;
import it.sogei.acrgs.platformms.dto.SectionDTO;
import it.sogei.acrgs.platformms.entity.GruppoAppartenenza;
import it.sogei.acrgs.platformms.entity.Piattaforma;
import it.sogei.acrgs.platformms.entity.RuoliRefAppartenenza;
import it.sogei.acrgs.platformms.entity.RuoliRefAppartenenzaId;
import it.sogei.acrgs.platformms.repository.GruppoAppartenenzaRepository;
import it.sogei.acrgs.platformms.repository.PiattaformaRepository;
import it.sogei.acrgs.platformms.repository.RuoliRefAppartenenzaRepository;
import it.sogei.acrgs.platformms.utils.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static it.sogei.acrgs.platformms.utils.Constants.FORM_STEPS;

@Slf4j
@Service
@RequiredArgsConstructor
public class GruppoAppartenenzaService {

    private final GruppoAppartenenzaRepository gruppoRepository;
    private final RuoliRefAppartenenzaRepository refRepository;
    private final PiattaformaRepository piattaformaRepository;
    private final ObjectMapper objectMapper;

    public boolean existsByNomeExcludingId(String nome, Long excludeId) {
        return gruppoRepository.countByCategoriaAndIdNot(nome, excludeId) > 0;
    }

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

    @Transactional(readOnly = true)
    public GruppoDependenciesDTO getDependencies(Long gruppoId) {
        List<GruppoDependenciesDTO.Dependency> deps = new ArrayList<>();
        deps.addAll(extractPiattaformeDependencies(gruppoId));
        deps.addAll(extractRuoliDependencies(gruppoId));
        return GruppoDependenciesDTO.builder().dependencies(deps).build();
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

    private List<GruppoDependenciesDTO.Dependency> extractPiattaformeDependencies(Long gruppoId) {
        List<GruppoDependenciesDTO.Dependency> dipendenze = new ArrayList<>();
        List<Piattaforma> allPiattaforme = piattaformaRepository.findAll();
        for (Piattaforma piattaforma : allPiattaforme) {
            String configJson = piattaforma.getConfigJson();
            if (configJson == null || configJson.isBlank()) continue;
            extractRoleGroups(configJson, gruppoId, piattaforma, dipendenze);
        }
        return dipendenze;
    }

    /**
     * estrae tutti i role_groups dal config_json di una piattaforma
     */
    private void extractRoleGroups(String configJson, Long gruppoId, Piattaforma piattaforma, List<GruppoDependenciesDTO.Dependency> dipendenze) {
        try {
            log.debug("Estrazione dipendenze per piattaforma {}, INIZIO", piattaforma.getId());
            JsonNode root = objectMapper.readTree(configJson);
            JsonNode formStepsNode = root.path(FORM_STEPS);
            if (formStepsNode.isArray()) {
                List<FormStepDTO> formSteps = objectMapper.convertValue(formStepsNode, new TypeReference<>() {
                });
                boolean trovato = false;
                for (FormStepDTO step : formSteps) {
                    if (null != step.getRoleGroups() && step.getRoleGroups().contains(gruppoId)) {
                        log.debug("Step {} contiene il gruppo {} ", step.getStep(), gruppoId);
                        trovato = true;
                        break;
                    }
                    if (null != step.getSections()) {
                        for (SectionDTO section : step.getSections()) {
                            if (null != section.getRoleGroups() && section.getRoleGroups().contains(gruppoId)) {
                                log.debug("Section {} contiene il gruppo {}", step.getStep(), gruppoId);
                                trovato = true;
                                break;
                            }
                        }
                        if (trovato) break;
                    }
                }
                if (trovato) {
                    dipendenze.add(GruppoDependenciesDTO.Dependency.builder()
                            .type(Constants.CRUSCOTTO_PIATTAFORMA)
                            .name(piattaforma.getNome())
                            .id(piattaforma.getId())
                            .build());
                }
                log.debug("Estrazione dipendenze per piattaforma {}, FINE", piattaforma.getId());
            }
        } catch (JsonProcessingException e) {
            log.error("Errore nel parse del json della piattaforma {}: {}", piattaforma.getId(), e.getMessage());
        }
    }

    /**
     * Estrae i ruoli associati al gruppo e alle piattaforme che li utilizzano
     */
    private List<GruppoDependenciesDTO.Dependency> extractRuoliDependencies(Long gruppoId) {
        return this.gruppoRepository.extractDependencies(gruppoId)
                .stream()
                .map(el -> new GruppoDependenciesDTO.Dependency(el.getType(), el.getName(), el.getId().longValue()))
                .toList();
    }
}
