package it.sogei.acrgs.platformms.startup;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import static it.sogei.acrgs.platformms.utils.Constants.*;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev")
public class SequenceInitializer {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void fixSequences() {
        fixSequence(TABLE_UTILITY_TOOL, SEQ_UTILITY_TOOL, COL_ID);
        fixSequence(TABLE_PIATTAFORMA, SEQ_PIATTAFORMA, COL_ID_PIATTAFORMA);
        fixSequence(TABLE_RUOLO, SEQ_RUOLO, COL_ID_RUOLO);
        fixSequence(TABLE_GRUPPO_APPARTENENZA, SEQ_GRUPPO, COL_ID_GRUPPO);
        fixSequence(TABLE_PIATTAFORMA_REF_PROCESS, SEQ_PIATTAFORMA_REF_PROCESS, COL_ID_PIATTAFORMA_REF_PROCESS);
    }

    /**
     * Allinea la sequenza con i dati presenti se necessario
     */
    private void fixSequence(String tableName, String sequenceName, String idColumn) {
        try {
            String querySelect = "SELECT MAX(%s) FROM %s".formatted(idColumn, tableName);
            Long maxId = jdbcTemplate.queryForObject(querySelect, Long.class);
            if (maxId == null) {
                maxId = 0L;
            }
            String queryMaxVal = "SELECT %s.NEXTVAL FROM DUAL".formatted(sequenceName);
            Long nextVal = jdbcTemplate.queryForObject(queryMaxVal, Long.class);
            if (nextVal <= maxId) {
                long salto = (maxId - nextVal) + 2;
                log.warn("La sequenza {} è indietro (max={}, next={}). Salto in avanti di {}.",
                        sequenceName, maxId, nextVal, salto);
                jdbcTemplate.execute("ALTER SEQUENCE " + sequenceName + " INCREMENT BY " + salto);
                jdbcTemplate.queryForObject("SELECT " + sequenceName + ".NEXTVAL FROM DUAL", Long.class);
                jdbcTemplate.execute("ALTER SEQUENCE " + sequenceName + " INCREMENT BY 1");
                log.info("Sequenza {} allineata. Il prossimo valore dovrebbe essere > {}", sequenceName, maxId);
            } else {
                log.debug("La sequenza {} è già avanti (max={}, next={})", sequenceName, maxId, nextVal);
            }
        } catch (Exception e) {
            log.error("Impossibile allineare la sequenza {}: {}", sequenceName, e.getMessage(), e);
        }
    }
}