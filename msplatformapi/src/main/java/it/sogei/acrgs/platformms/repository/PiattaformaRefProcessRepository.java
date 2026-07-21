package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.PiattaformaRefProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PiattaformaRefProcessRepository extends JpaRepository<PiattaformaRefProcess, Long> {

    List<PiattaformaRefProcess> findByIdPiattaforma_Id(Long idPiattaforma);

    @Query("select distinct p.processKey from PiattaformaRefProcess p where p.processKey <> :ticketKey order by p.processKey")
    List<String> findDistinctProcessKeys(@Param("ticketKey") String ticketKey);
}
