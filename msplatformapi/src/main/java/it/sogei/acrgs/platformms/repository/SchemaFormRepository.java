package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.SchemaForm;
import it.sogei.acrgs.platformms.entity.SchemaFormId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemaFormRepository extends JpaRepository<SchemaForm, SchemaFormId> {

    List<SchemaForm> findByIdPiattaformaAndProcessKey(Long idPiattaforma, String processKey);

    void deleteByIdPiattaformaAndProcessKey(Long idPiattaforma, String processKey);
}
