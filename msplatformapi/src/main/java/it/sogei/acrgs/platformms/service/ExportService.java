package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.*;
import it.sogei.acrgs.platformms.exceptions.ExportException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static it.sogei.acrgs.platformms.utils.Constants.NOME_SCHEMA;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final PersistenceService persistenceService;
    private final PiattaformaService piattaformaService;
    private final Environment environment;

    public byte[] exportSqlZip(PersistenceObjectDTO dto) throws ExportException {
        List<String> errors = persistenceService.validate(dto, new ArrayList<>());
        if (!errors.isEmpty()) {
            log.error("Errore nella validazione dei dati: {}", errors);
            throw new ExportException(errors);
        }
        String script = buildSqlScript(dto);
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
        sql.append("SET DEFINE OFF;\n\n");
        // piattaforma
        PiattaformaDTO piattaforma = dto.getPiattaforma();
        if (null != piattaforma) {
            if (null != piattaforma.getId() && piattaforma.getId() > 0) {
                appendUpdate(sql, "PIATTAFORMA", buildPlatformColumns(piattaforma), "ID_PIATTAFORMA", piattaforma.getId());
            } else {
                appendInsert(sql, "PIATTAFORMA", buildPlatformColumns(piattaforma), "ID_PIATTAFORMA", "SEQ_PIATTAFORMA.NEXTVAL");
            }
        }
        // ruoli e tabella brige ruoli_ref_appartenenza
        List<RuoloDTO> ruoli = null != dto.getRuoli() ? dto.getRuoli() : Collections.emptyList();
        for (RuoloDTO ruolo : ruoli) {
            if (ruolo.isDaEliminare() && null != ruolo.getId() && ruolo.getId() > 0) {
                sql.append("DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_RUOLO = ").append(ruolo.getId()).append(";\n");
                appendDelete(sql, "RUOLO", "ID_RUOLO", ruolo.getId());
            } else if (null != ruolo.getId() && ruolo.getId() > 0) {
                appendUpdate(sql, "RUOLO", buildRuoloColumns(ruolo), "ID_RUOLO", ruolo.getId());
            } else {
                // nuovo ruolo, inserimento con sequenza
                Map<String, String> cols = buildRuoloColumns(ruolo);
                String idPiattaformaExpr;
                if (null != piattaforma.getId() && piattaforma.getId() > 0) {
                    idPiattaformaExpr = piattaforma.getId().toString();
                } else {
                    idPiattaformaExpr = "SEQ_PIATTAFORMA.CURRVAL";
                }
                cols.put("ID_PIATTAFORMA", idPiattaformaExpr);
                appendInsert(sql, "RUOLO", cols, "ID_RUOLO", "SEQ_RUOLO.NEXTVAL");
            }
        }
        // gruppi e tavola brige ruoli_ref_appartenenza
        List<GruppoAppartenenzaDTO> gruppi = null != dto.getGruppiAppartenenza() ? dto.getGruppiAppartenenza() : Collections.emptyList();
        for (GruppoAppartenenzaDTO gruppo : gruppi) {
            if (gruppo.isDaEliminare() && null != gruppo.getId() && gruppo.getId() > 0) {
                sql.append("DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_GRUPPO_APPARTENENZA = ").append(gruppo.getId()).append(";\n");
                appendDelete(sql, "GRUPPO_APPARTENENZA_RUOLI", "ID_GRUPPO_APPARTENENZA", gruppo.getId());
            } else if (null != gruppo.getId() && gruppo.getId() > 0) {
                // Update group metadata
                appendUpdate(sql, "GRUPPO_APPARTENENZA_RUOLI", buildGruppoColumns(gruppo), "ID_GRUPPO_APPARTENENZA", gruppo.getId());
                // delete vecchi dati in bridge table
                sql.append("DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_GRUPPO_APPARTENENZA = ").append(gruppo.getId()).append(";\n");
                // insert nuovi date in bridge table
                for (Long ruoloId : gruppo.getRuoliIds()) {
                    String roleIdExpr = resolveRoleIdForSql(ruoloId);
                    sql.append("INSERT INTO RUOLI_REF_APPARTENENZA (ID_RUOLO, ID_GRUPPO_APPARTENENZA) VALUES (")
                            .append(roleIdExpr).append(", ").append(gruppo.getId()).append(");\n");
                }
            } else {
                // nuovo gruppo, inserimento con sequenza
                Map<String, String> cols = buildGruppoColumns(gruppo);
                appendInsert(sql, "GRUPPO_APPARTENENZA_RUOLI", cols, "ID_GRUPPO_APPARTENENZA", "SEQ_GRUPPO_DI_APPARTENENZA_RUOLI.NEXTVAL");
                for (Long ruoloId : gruppo.getRuoliIds()) {
                    String roleIdExpr = resolveRoleIdForSql(ruoloId);
                    sql.append("INSERT INTO RUOLI_REF_APPARTENENZA (ID_RUOLO, ID_GRUPPO_APPARTENENZA) VALUES (")
                            .append(roleIdExpr).append(", SEQ_GRUPPO_DI_APPARTENENZA_RUOLI.CURRVAL);\n");
                }
            }
        }
        // TODO abilitazioni e cruscotto
        return sql.toString();
    }
    private String resolveRoleIdForSql(Long roleId) {
        if (null == roleId) return "NULL";
        if (roleId < 0) {
            return "SEQ_RUOLO.CURRVAL";
        }
        return roleId.toString();
    }

    // metodi helper per sql
    private void appendInsert(StringBuilder sql, String table, Map<String, String> columns, String pkCol, String seqExpr) {
        String fullTable = tableName(table);
        String colNames = columns.keySet().stream().collect(Collectors.joining(", "));
        String colValues = columns.values().stream().collect(Collectors.joining(", "));
        sql.append("INSERT INTO ").append(fullTable).append(" (").append(pkCol).append(", ").append(colNames).append(")\n");
        sql.append("VALUES (").append(seqExpr).append(", ").append(colValues).append(");\n");
    }

    private void appendUpdate(StringBuilder sql, String table, Map<String, String> columns, String pkCol, Object pkValue) {
        String fullTable = tableName(table);
        String setClause = columns.entrySet().stream()
                .map(e -> e.getKey() + " = " + e.getValue())
                .collect(Collectors.joining(", "));
        sql.append("UPDATE ").append(fullTable).append(" SET ").append(setClause)
                .append(" WHERE ").append(pkCol).append(" = ").append(pkValue).append(";\n");
    }

    private void appendDelete(StringBuilder sql, String table, String pkCol, Object pkValue) {
        String fullTable = tableName(table);
        sql.append("DELETE FROM ").append(fullTable).append(" WHERE ").append(pkCol).append(" = ").append(pkValue).append(";\n");
    }

    // builder colonne
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
        cols.put("CONFIG_JSON", quote(piattaformaService.toConfigJson(dto)));
        return cols;
    }

    private Map<String, String> buildRuoloColumns(RuoloDTO dto) {
        Map<String, String> cols = new LinkedHashMap<>();
        cols.put("NOME", quote(dto.getNome()));
        cols.put("DESCRIZIONE", quote(dto.getDescrizione()));
        cols.put("RICHIEDIBILE_DA_PROCESSO", boolToInt(dto.isRichiedibileDaProcesso()));
        return cols;
    }

    private Map<String, String> buildGruppoColumns(GruppoAppartenenzaDTO dto) {
        Map<String, String> cols = new LinkedHashMap<>();
        cols.put("CATEGORIA", quote(dto.getNome()));
        cols.put("DESCRIZIONE", quote(dto.getDescrizione()));
        return cols;
    }

    // helper per format
    private String quote(String value) {
        if (null == value) return "NULL";
        return "'" + value.replace("'", "''") + "'";
    }

    private String nullToSql(Object value) {
        if (null == value) return "NULL";
        if (value instanceof String) return quote((String) value);
        return value.toString();
    }

    private String boolToInt(Boolean bool) {
        return (null != bool && bool) ? "1" : "0";
    }

    // env
    private String getPrefissoSchema () {
        if (Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
            return "";
        }
        return NOME_SCHEMA + ".";
    }

    private String tableName(String table) {
        return getPrefissoSchema() + table;
    }
}