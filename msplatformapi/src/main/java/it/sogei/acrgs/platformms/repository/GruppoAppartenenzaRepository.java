package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.dto.projection.DependencyProjection;
import it.sogei.acrgs.platformms.entity.GruppoAppartenenza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GruppoAppartenenzaRepository extends JpaRepository<GruppoAppartenenza, Long> {

    @Query(value = "select 'RUOLO' as type, NVL(r.nome || ' (' || p.nome || ')', 'NA') as name, r.id_ruolo as id " +
            "from piattaforma p " +
            "join ruolo r on p.id_piattaforma = r.id_piattaforma " +
            "join ruoli_ref_appartenenza rf on rf.id_ruolo = r.id_ruolo " +
            "join gruppo_appartenenza_ruoli g on g.id_gruppo_appartenenza = rf.id_gruppo_appartenenza " +
            "where g.id_gruppo_appartenenza = :gruppoId", nativeQuery = true)
    List<DependencyProjection> extractDependencies(Long gruppoId);
}
