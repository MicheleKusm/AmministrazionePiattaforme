package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.Ruolo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuoloRepository extends JpaRepository<Ruolo, Long> {
    List<Ruolo> findByIdPiattaforma(Long idPiattaforma);
}
