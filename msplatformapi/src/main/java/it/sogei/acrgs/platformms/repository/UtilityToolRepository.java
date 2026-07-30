package it.sogei.acrgs.platformms.repository;

import it.sogei.acrgs.platformms.entity.UtilityTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilityToolRepository extends JpaRepository<UtilityTool, String> {

    List<UtilityTool> findByType(String type);
}
