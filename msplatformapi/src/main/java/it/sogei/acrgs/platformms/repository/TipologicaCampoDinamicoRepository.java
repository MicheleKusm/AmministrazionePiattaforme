package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.TipologicaCampoDinamico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipologicaCampoDinamicoRepository extends JpaRepository<TipologicaCampoDinamico, String> {
}
