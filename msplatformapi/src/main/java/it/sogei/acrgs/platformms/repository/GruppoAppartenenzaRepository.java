package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.GruppoAppartenenza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GruppoAppartenenzaRepository extends JpaRepository<GruppoAppartenenza, Long> {
    List<GruppoAppartenenza> findByIdPiattaforma(Long idPiattaforma);
}
