package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.GruppoAppartenenzaDTO;
import it.sogei.acrgs.platformms.entity.GruppoAppartenenza;
import it.sogei.acrgs.platformms.entity.RuoliRefAppartenenza;
import it.sogei.acrgs.platformms.entity.RuoliRefAppartenenzaId;
import it.sogei.acrgs.platformms.repository.GruppoAppartenenzaRepository;
import it.sogei.acrgs.platformms.repository.RuoliRefAppartenenzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GruppoAppartenenzaService {

    private final GruppoAppartenenzaRepository gruppoRepository;
    private final RuoliRefAppartenenzaRepository refRepository;

    @Transactional(readOnly = true)
    public List<GruppoAppartenenzaDTO> listByPiattaforma(Long idPiattaforma) {
        return gruppoRepository.findByIdPiattaforma(idPiattaforma).stream().map(this::toDto).toList();
    }

    @Transactional
    public GruppoAppartenenzaDTO create(GruppoAppartenenzaDTO dto) {
        GruppoAppartenenza gruppo = new GruppoAppartenenza();
        gruppo.setIdPiattaforma(dto.getIdPiattaforma());
        gruppo.setNome(dto.getNome());
        gruppo.setDescrizione(dto.getDescrizione());
        GruppoAppartenenza saved = gruppoRepository.save(gruppo);
        saveRefs(saved.getId(), dto.getRuoliIds());
        return toDto(saved);
    }

    @Transactional
    public GruppoAppartenenzaDTO update(Long id, GruppoAppartenenzaDTO dto) {
        GruppoAppartenenza gruppo = gruppoRepository.findById(id).orElseThrow();
        gruppo.setIdPiattaforma(dto.getIdPiattaforma());
        gruppo.setNome(dto.getNome());
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
                .idPiattaforma(entity.getIdPiattaforma())
                .nome(entity.getNome())
                .descrizione(entity.getDescrizione())
                .ruoliIds(ruoliIds)
                .build();
    }
}
