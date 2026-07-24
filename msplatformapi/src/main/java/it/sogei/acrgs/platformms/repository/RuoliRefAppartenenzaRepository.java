package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.RuoliRefAppartenenza;
import it.sogei.acrgs.platformms.entity.RuoliRefAppartenenzaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuoliRefAppartenenzaRepository extends JpaRepository<RuoliRefAppartenenza, RuoliRefAppartenenzaId> {
    List<RuoliRefAppartenenza> findByIdIdGruppoAppartenenza(Long idGruppoAppartenenza);

    void deleteByIdIdGruppoAppartenenza(Long idGruppoAppartenenza);

    void deleteByIdIdRuolo(Long idRuolo);
}
