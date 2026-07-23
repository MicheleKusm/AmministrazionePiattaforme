package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.dto.projection.DependencyProjection;
import it.sogei.acrgs.platformms.entity.GruppoAppartenenza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GruppoAppartenenzaRepository extends JpaRepository<GruppoAppartenenza, Long> {

    String SELECT_DIPENDENZE_RUOLO  = "select 'RUOLO' as type, NVL(r.nome || ' (' || p.nome || ')', 'NA') as name, r.id_ruolo as id " +
            "from piattaforma p " +
            "join ruolo r on p.id_piattaforma = r.id_piattaforma " +
            "join ruoli_ref_appartenenza rf on rf.id_ruolo = r.id_ruolo " +
            "join gruppo_appartenenza_ruoli g on g.id_gruppo_appartenenza = rf.id_gruppo_appartenenza " +
            "where g.id_gruppo_appartenenza = :gruppoId";
    String COUNT_GRUPPO_APPARENTENZA_NOME = "SELECT COUNT(g) FROM GruppoAppartenenza g WHERE g.categoria = :nome AND (:excludeId IS NULL OR g.id != :excludeId)";
    String CHECK_UNICITA_GRPPO_RUOLO = "SELECT COUNT(ref) FROM RuoliRefAppartenenza ref WHERE ref.id.idRuolo = :idRuolo AND ref.id.idGruppoAppartenenza = :idGruppo";

    @Query(value = SELECT_DIPENDENZE_RUOLO, nativeQuery = true)
    List<DependencyProjection> extractDependencies(Long gruppoId);

    @Query(COUNT_GRUPPO_APPARENTENZA_NOME)
    int countByCategoriaAndIdNot(@Param("nome") String nome, @Param("excludeId") Long excludeId);

    @Query(CHECK_UNICITA_GRPPO_RUOLO)
    int countByRuoloAndGruppo(@Param("idRuolo") Long idRuolo, @Param("idGruppo") Long idGruppo);
}
