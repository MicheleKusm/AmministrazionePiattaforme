package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.Piattaforma;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PiattaformaRepository extends JpaRepository<Piattaforma, Long> {
    Page<Piattaforma> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
}
