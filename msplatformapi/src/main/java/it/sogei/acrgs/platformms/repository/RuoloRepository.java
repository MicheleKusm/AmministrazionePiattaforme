package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.Ruolo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuoloRepository extends JpaRepository<Ruolo, Long> {
    String COUNT_NOME_BY_PIATTAFORMA = "SELECT COUNT(r) FROM Ruolo r WHERE r.nome = :nome AND r.idPiattaforma = :idPiattaforma AND (:excludeId IS NULL OR r.id != :excludeId)";
    List<Ruolo> findByIdPiattaforma(Long idPiattaforma);

    @Query("SELECT r FROM Ruolo r JOIN RuoliRefAppartenenza ref ON r.id = ref.id.idRuolo WHERE ref.id.idGruppoAppartenenza = :gruppoId")
    List<Ruolo> findByGruppoAppartenenzaId(@Param("gruppoId") Long gruppoId);

    @Query(COUNT_NOME_BY_PIATTAFORMA)
    int countByNomeAndIdPiattaformaAndIdNot(@Param("nome") String nome,
                                            @Param("idPiattaforma") Long idPiattaforma,
                                            @Param("excludeId") Long excludeId);
}
