package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.*;
import it.sogei.acrgs.platformms.exceptions.ExportException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static it.sogei.acrgs.platformms.utils.Constants.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final PersistenceService persistenceService;
    private final PiattaformaService piattaformaService;

    public byte[] exportSqlZip(PersistenceObjectDTO dto) throws ExportException {
        // validazione
        List<String> errors = persistenceService.validate(dto, new ArrayList<>());
        if (!errors.isEmpty()) {
            log.error("Errore nella validazione dei dati: {}", errors);
            throw new ExportException(errors);
        }
        // generazione dml
        String script = buildSqlScript(dto);
        // zip
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {
            ZipEntry entry = new ZipEntry("export.sql");
            zos.putNextEntry(entry);
            zos.write(script.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
            zos.finish();
            return baos.toByteArray();
        } catch (IOException e) {
            log.error("Errore durante la creazione del file ZIP", e);
            throw new ExportException("Errore durante la creazione del file ZIP: " + e.getMessage());
        }
    }

    private String buildSqlScript(PersistenceObjectDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(String.format(SQL_EXPORT_HEADER, new Timestamp(System.currentTimeMillis())));
        List<RuoloDTO> ruoli = dto.getRuoli() != null ? dto.getRuoli() : Collections.emptyList();
        List<GruppoAppartenenzaDTO> gruppi = dto.getGruppiAppartenenza() != null ? dto.getGruppiAppartenenza() : Collections.emptyList();
        int nuoviGruppi = 0;
        for (RuoloDTO r : ruoli) {
            if (r.getId() == null || r.getId() <= 0) nuoviGruppi++;
        }
        int nuoviRuoli = 0;
        for (GruppoAppartenenzaDTO g : gruppi) {
            if (g.getId() == null || g.getId() <= 0) nuoviRuoli++;
        }
        sql.append(SQL_DECLARE_HEADER);
        sql.append(String.format(SQL_DECLARE_VAR, "v_piattaforma_id"));
        for (int i = 1; i <= nuoviGruppi; i++) {
            sql.append(String.format(SQL_DECLARE_VAR, "v_ruolo_" + i));
        }
        for (int i = 1; i <= nuoviRuoli; i++) {
            sql.append(String.format(SQL_DECLARE_VAR, "v_gruppo_" + i));
        }
        sql.append(SQL_BEGIN);
        handlePiattaforma(sql, dto.getPiattaforma());
        Map<Long, String> tempRoleMap = handleRuoli(sql, ruoli);
        handleGruppi(sql, gruppi, tempRoleMap);
        handleAbilitazioni(sql, dto.getAbilitazioni(), tempRoleMap);
        sql.append(SQL_FOOTER);
        return sql.toString();
    }

// handlder per le entity
    private void handlePiattaforma(StringBuilder sql, PiattaformaDTO piattaforma) {
        if (piattaforma == null) return;
        if (piattaforma.getId() != null && piattaforma.getId() > 0) {
            appendUpdate(sql, "PIATTAFORMA", buildPlatformColumns(piattaforma), "ID_PIATTAFORMA", piattaforma.getId());
            sql.append("  v_piattaforma_id := ").append(piattaforma.getId()).append(";\n");
        } else {
            appendInsert(sql, "PIATTAFORMA", buildPlatformColumns(piattaforma), "ID_PIATTAFORMA", "SEQ_PIATTAFORMA.NEXTVAL", "v_piattaforma_id");
        }
    }

    private Map<Long, String> handleRuoli(StringBuilder sql, List<RuoloDTO> ruoli) {
        Map<Long, String> tempRoleMap = new LinkedHashMap<>();
        if (ruoli == null || ruoli.isEmpty()) return tempRoleMap;
        int roleCounter = 0;
        for (RuoloDTO ruolo : ruoli) {
            if (ruolo.isDaEliminare() && ruolo.getId() != null && ruolo.getId() > 0) {
                sql.append("  DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_RUOLO = ").append(ruolo.getId()).append(";\n");
                appendDelete(sql, "RUOLO", "ID_RUOLO", ruolo.getId());
            } else if (ruolo.getId() != null && ruolo.getId() > 0) {
                appendUpdate(sql, "RUOLO", buildRuoloColumns(ruolo), "ID_RUOLO", ruolo.getId());
            } else {
                String varName = "v_ruolo_" + (++roleCounter);
                tempRoleMap.put(ruolo.getId() != null ? ruolo.getId() : -roleCounter, varName);
                Map<String, String> cols = buildRuoloColumns(ruolo);
                cols.put("ID_PIATTAFORMA", "v_piattaforma_id");
                appendInsert(sql, "RUOLO", cols, "ID_RUOLO", "SEQ_RUOLO.NEXTVAL", varName);
            }
        }
        return tempRoleMap;
    }

    private void handleGruppi(StringBuilder sql, List<GruppoAppartenenzaDTO> gruppi, Map<Long, String> tempRoleMap) {
        if (gruppi == null || gruppi.isEmpty()) return;
        // TODO
    }

    private void handleAbilitazioni(StringBuilder sql, List<AbilitazioneDTO> abilitazioni, Map<Long, String> tempRoleMap) {
        if (abilitazioni == null || abilitazioni.isEmpty()) return;
        // TODO
    }

    private void appendInsert(StringBuilder sql, String table, Map<String, String> columns, String pkCol, String seqExpr, String returnVar) {
        String colNames = pkCol + ", " + columns.keySet().stream().collect(Collectors.joining(", "));
        String colValues = seqExpr + ", " + columns.values().stream().collect(Collectors.joining(", "));
        sql.append("  INSERT INTO ").append(table).append(" (").append(colNames).append(")\n");
        sql.append("  VALUES (").append(colValues).append(") RETURNING ").append(pkCol).append(" INTO ").append(returnVar).append(";\n");
    }

    private void appendUpdate(StringBuilder sql, String table, Map<String, String> columns, String pkCol, Object pkValue) {
        String setClause = columns.entrySet().stream()
                .map(e -> e.getKey() + " = " + e.getValue())
                .collect(Collectors.joining(", "));
        sql.append("  UPDATE ").append(table).append(" SET ").append(setClause)
                .append(" WHERE ").append(pkCol).append(" = ").append(pkValue).append(";\n");
    }

    private void appendDelete(StringBuilder sql, String table, String pkCol, Object pkValue) {
        sql.append("  DELETE FROM ").append(table).append(" WHERE ").append(pkCol).append(" = ").append(pkValue).append(";\n");
    }

    private Map<String, String> buildPlatformColumns(PiattaformaDTO dto) {
        Map<String, String> cols = new LinkedHashMap<>();
        cols.put("NOME", quote(dto.getNome()));
        cols.put("DESCRIZIONE", quote(dto.getDescrizione()));
        cols.put("URL", nullToSql(dto.getUrl()));
        cols.put("CANALE", quote(dto.getCanale()));
        cols.put("OBJ_CLASS", quote(dto.getObjClass()));
        cols.put("READ_ONLY", boolToInt(dto.getReadOnly()));
        cols.put("CODICE_ICT", nullToSql(dto.getCodiceIct()));
        cols.put("RICHIEDIBILE_DA_CRUSCOTTO", boolToInt(dto.getRichiedibileDaCruscotto()));
        cols.put("RICHIEDIBILE_IN_CORSO", boolToInt(dto.getRichiedibileInCorso()));
        cols.put("RIPETIBILE", boolToInt(dto.getRipetibile()));
        cols.put("UTILIZZO_MODELLO_AUTORIZZATIVO", boolToInt(dto.getUtilizzoModelloAutorizzativo()));
        String configJson = piattaformaService.toConfigJson(dto);
        cols.put("CONFIG_JSON", quote(configJson));
        return cols;
    }

    private Map<String, String> buildRuoloColumns(RuoloDTO dto) {
        Map<String, String> cols = new LinkedHashMap<>();
        cols.put("NOME", quote(dto.getNome()));
        cols.put("DESCRIZIONE", quote(dto.getDescrizione()));
        cols.put("RICHIEDIBILE_DA_PROCESSO", boolToInt(dto.isRichiedibileDaProcesso()));
        return cols;
    }

     private String quote(String value) {
        if (value == null) return "NULL";
        return "'" + value.replace("'", "''") + "'";
    }

    private String nullToSql(Object value) {
        if (value == null) return "NULL";
        if (value instanceof String) return quote((String) value);
        return value.toString();
    }

    private String boolToInt(Boolean b) {
        return (b != null && b) ? "1" : "0";
    }
}