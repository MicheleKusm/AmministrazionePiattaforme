package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.RuoloDTO;
import it.sogei.acrgs.platformms.entity.Ruolo;
import it.sogei.acrgs.platformms.repository.RuoloRepository;
import it.sogei.acrgs.platformms.utils.Utility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RuoloService {

    private final RuoloRepository ruoloRepository;

    public boolean existsByNomeAndPiattaformaExcludingId(String nome, Long idPiattaforma, Long excludeId) {
        return ruoloRepository.countByNomeAndIdPiattaformaAndIdNot(nome, idPiattaforma, excludeId) > 0;
    }

    @Transactional(readOnly = true)
    public List<RuoloDTO> listByPiattaforma(Long idPiattaforma) {
        return ruoloRepository.findByIdPiattaforma(idPiattaforma).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<RuoloDTO> listAll() {
        return ruoloRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public RuoloDTO create(RuoloDTO dto) {
        Ruolo ruolo = new Ruolo();
        ruolo.setIdPiattaforma(dto.getIdPiattaforma());
        ruolo.setNome(dto.getNome());
        ruolo.setDescrizione(dto.getDescrizione());
        ruolo.setRichiedibileDaProcesso(Boolean.TRUE.equals(dto.isRichiedibileDaProcesso()) ? 1L : 0L);
        return toDto(ruoloRepository.save(ruolo));
    }

    @Transactional
    public RuoloDTO update(Long id, RuoloDTO dto) {
        Ruolo ruolo = ruoloRepository.findById(id).orElseThrow();
        ruolo.setIdPiattaforma(dto.getIdPiattaforma());
        ruolo.setNome(dto.getNome());
        ruolo.setDescrizione(dto.getDescrizione());
        ruolo.setRichiedibileDaProcesso(Boolean.TRUE.equals(dto.isRichiedibileDaProcesso()) ? 1L : 0L);
        return toDto(ruoloRepository.save(ruolo));
    }

    @Transactional
    public void delete(Long id) {
        ruoloRepository.deleteById(id);
    }

    private RuoloDTO toDto(Ruolo entity) {
        return RuoloDTO.builder()
                .id(entity.getId())
                .idPiattaforma(entity.getIdPiattaforma())
                .richiedibileDaProcesso(new Utility().convertToBoolean(entity.getRichiedibileDaProcesso()))
                .nome(entity.getNome())
                .descrizione(entity.getDescrizione())
                .build();
    }
}
