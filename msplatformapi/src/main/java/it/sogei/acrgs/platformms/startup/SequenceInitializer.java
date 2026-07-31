package it.sogei.acrgs.platformms.startup;

import it.sogei.acrgs.platformms.utils.records.SequenceConfig;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import static it.sogei.acrgs.platformms.utils.Constants.SEQUENCE_CONFIG_LIST;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev")
public class SequenceInitializer {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void fixSequences() {
        for (SequenceConfig sequenceConfig : SEQUENCE_CONFIG_LIST) {
            fixSequence(sequenceConfig);
        }
    }

    /**
     * Allinea la sequenza con i dati presenti se necessario
     */
    private void fixSequence(SequenceConfig sequenceConfig) {
        try {
            String querySelect = "SELECT MAX(%s) FROM %s".formatted(sequenceConfig.idColumn(), sequenceConfig.tableName());
            Long maxId = jdbcTemplate.queryForObject(querySelect, Long.class);
            if (null == maxId) {
                maxId = 0L;
            }
            String queryMaxVal = "SELECT %s.NEXTVAL FROM DUAL".formatted(sequenceConfig.sequenceName());
            Long nextVal = jdbcTemplate.queryForObject(queryMaxVal, Long.class);
            if (nextVal <= maxId) {
                long salto = (maxId - nextVal) + 2;
                log.warn("La sequenza {} è indietro (max={}, next={}). Salto in avanti di {}.", sequenceConfig.sequenceName(), maxId, nextVal, salto);
                jdbcTemplate.execute(writeAlterQuery(sequenceConfig.sequenceName(), salto));
                jdbcTemplate.queryForObject("SELECT " + sequenceConfig.sequenceName() + ".NEXTVAL FROM DUAL", Long.class);
                jdbcTemplate.execute(writeAlterQuery(sequenceConfig.sequenceName(), 1));
                log.info("Sequenza {} allineata. Il prossimo valore dovrebbe essere > {}", sequenceConfig.sequenceName(), maxId);
            } else {
                log.debug("La sequenza {} è già avanti (max={}, next={})", sequenceConfig.sequenceName(), maxId, nextVal);
            }
        } catch (Exception e) {
            log.error("Impossibile allineare la sequenza {}: {}", sequenceConfig.sequenceName(), e.getMessage(), e);
        }
    }

    private String writeAlterQuery(String sequenceName, long increment) {
        return String.format("ALTER SEQUENCE %s INCREMENT BY %d", sequenceName, increment);
    }
}