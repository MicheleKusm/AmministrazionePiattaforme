package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.Piattaforma;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PiattaformaRepository extends JpaRepository<Piattaforma, Long> {
    String QUERY_COUNT_PIATTAFORMA_VALIDATE_NOME_OBJCLASS = "SELECT COUNT(p) FROM Piattaforma p WHERE (p.nome = :nome OR p.objClass = :objClass) AND (:id IS NULL OR p.id != :id)";

    Page<Piattaforma> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    @Query(QUERY_COUNT_PIATTAFORMA_VALIDATE_NOME_OBJCLASS)
    int countByNomeOrObjClassExcludeId(@Param("nome") String nome, @Param("objClass") String objClass, @Param("id") Long id);
}
