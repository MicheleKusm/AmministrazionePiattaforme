package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.sogei.acrgs.platformms.dto.*;
import it.sogei.acrgs.platformms.exceptions.ExportException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    private final ObjectMapper objectMapper;
    private final Environment environment;
    @Value("${show-export-schema}")
    private Boolean showExportSchema;

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
        appendPiattaforma(sql, dto.getPiattaforma());
        appendRuoli(sql, dto.getRuoli(), dto.getPiattaforma());
        appendGruppi(sql, dto.getGruppiAppartenenza(), dto.getRuoli(), dto.getPiattaforma());
        appendAbilitazioni(sql, dto, dto.getPiattaforma());
        return sql.toString();
    }

    private String resolveRoleIdForSql(Long roleId, List<RuoloDTO> ruoli, PiattaformaDTO piattaforma) {
        if (null == roleId) return "NULL";
        if (roleId > 0) return roleId.toString();
        // roleId < 0 -> nuovo
        for (RuoloDTO ruolo : ruoli) {
            if (null != ruolo.getId() && ruolo.getId().equals(roleId)) {
                return "(SELECT ID_RUOLO FROM " + tableName("RUOLO")
                        + " WHERE NOME = " + quote(ruolo.getNome())
                        + " AND ID_PIATTAFORMA = " + piattaformaIdExpr(piattaforma) + ")";
            }
        }
        return "NULL";
    }

    // piattaforma
    private void appendPiattaforma(StringBuilder sql, PiattaformaDTO piattaforma) {
        if (null == piattaforma) return;
        if (null != piattaforma.getId() && piattaforma.getId() > 0) {
            appendUpdate(sql, "PIATTAFORMA", buildPlatformColumns(piattaforma), "ID_PIATTAFORMA", piattaforma.getId());
        } else {
            appendInsert(sql, "PIATTAFORMA", buildPlatformColumns(piattaforma), "ID_PIATTAFORMA", "SEQ_PIATTAFORMA.NEXTVAL");
        }
    }

    // ruoli e bridge
    private void appendRuoli(StringBuilder sql, List<RuoloDTO> ruoli, PiattaformaDTO piattaforma) {
        if (null == ruoli || ruoli.isEmpty()) return;
        for (RuoloDTO ruolo : ruoli) {
            if (ruolo.isDaEliminare() && null != ruolo.getId() && ruolo.getId() > 0) {
                sql.append("DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_RUOLO = ").append(ruolo.getId()).append(";\n");
                appendDelete(sql, "RUOLO", "ID_RUOLO", ruolo.getId());
            } else if (null != ruolo.getId() && ruolo.getId() > 0) {
                appendUpdate(sql, "RUOLO", buildRuoloColumns(ruolo), "ID_RUOLO", ruolo.getId());
            } else {
                Map<String, String> cols = buildRuoloColumns(ruolo);
                cols.put("ID_PIATTAFORMA", piattaformaIdExpr(piattaforma));
                appendInsert(sql, "RUOLO", cols, "ID_RUOLO", "SEQ_RUOLO.NEXTVAL");
            }
        }
    }

    // gruppi e bridge
    private void appendGruppi(StringBuilder sql, List<GruppoAppartenenzaDTO> gruppi, List<RuoloDTO> ruoli, PiattaformaDTO piattaforma) {
        if (null == gruppi || gruppi.isEmpty()) return;
        for (GruppoAppartenenzaDTO gruppo : gruppi) {
            if (gruppo.isDaEliminare() && null != gruppo.getId() && gruppo.getId() > 0) {
                sql.append("DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_GRUPPO_APPARTENENZA = ").append(gruppo.getId()).append(";\n");
                appendDelete(sql, "GRUPPO_APPARTENENZA_RUOLI", "ID_GRUPPO_APPARTENENZA", gruppo.getId());
            } else if (null != gruppo.getId() && gruppo.getId() > 0) {
                appendUpdate(sql, "GRUPPO_APPARTENENZA_RUOLI", buildGruppoColumns(gruppo), "ID_GRUPPO_APPARTENENZA", gruppo.getId());
                sql.append("DELETE FROM RUOLI_REF_APPARTENENZA WHERE ID_GRUPPO_APPARTENENZA = ").append(gruppo.getId()).append(";\n");
                for (Long ruoloId : gruppo.getRuoliIds()) {
                    String roleIdExpr = resolveRoleIdForSql(ruoloId, ruoli, piattaforma);
                    sql.append("INSERT INTO RUOLI_REF_APPARTENENZA (ID_RUOLO, ID_GRUPPO_APPARTENENZA) VALUES (")
                            .append(roleIdExpr).append(", ").append(gruppo.getId()).append(");\n");
                }
            } else {
                Map<String, String> cols = buildGruppoColumns(gruppo);
                appendInsert(sql, "GRUPPO_APPARTENENZA_RUOLI", cols, "ID_GRUPPO_APPARTENENZA", "SEQ_GRUPPO_DI_APPARTENENZA_RUOLI.NEXTVAL");
                String gruppoIdExpr = "(SELECT ID_GRUPPO_APPARTENENZA FROM " + tableName("GRUPPO_APPARTENENZA_RUOLI")
                        + " WHERE CATEGORIA = " + quote(gruppo.getNome()) + ")";
                for (Long ruoloId : gruppo.getRuoliIds()) {
                    String roleIdExpr = resolveRoleIdForSql(ruoloId, ruoli, piattaforma);
                    sql.append("INSERT INTO RUOLI_REF_APPARTENENZA (ID_RUOLO, ID_GRUPPO_APPARTENENZA) VALUES (")
                            .append(roleIdExpr).append(", ").append(gruppoIdExpr).append(");\n");
                }
            }
        }
    }

    // abilitazioni -> PIATTAFORMA_REF_PROCESS
    private void appendAbilitazioni(StringBuilder sql, PersistenceObjectDTO dto, PiattaformaDTO piattaforma) {
        List<AbilitazioneDTO> abilitazioni = null != dto.getAbilitazioni() ? dto.getAbilitazioni() : Collections.emptyList();
        for (AbilitazioneDTO abilitazione : abilitazioni) {
            if (abilitazione.isDaEliminare() && null != abilitazione.getId() && abilitazione.getId() > 0) {
                appendDelete(sql, "PIATTAFORMA_REF_PROCESS", "ID_PIATTAFORMA_REF_PROCESS", abilitazione.getId());
            } else if (abilitazione.isDaEliminare()) {
                // nuova abilitazione marcata daEliminare: nessuna azione
            } else if (null != abilitazione.getId() && abilitazione.getId() > 0) {
                appendUpdate(sql, "PIATTAFORMA_REF_PROCESS", buildAbilitazioneColumns(abilitazione, piattaforma, false), "ID_PIATTAFORMA_REF_PROCESS", abilitazione.getId());
            } else {
                appendInsert(sql, "PIATTAFORMA_REF_PROCESS", buildAbilitazioneColumns(abilitazione, piattaforma, true), "ID_PIATTAFORMA_REF_PROCESS", "SEQ_PIATTAFORMA_REF_PROCESS.NEXTVAL");
            }
        }
    }

    private Map<String, String> buildAbilitazioneColumns(AbilitazioneDTO dto, PiattaformaDTO piattaforma, boolean insert) {
        boolean ticket = "TICKET".equalsIgnoreCase(dto.getTipo());
        Map<String, String> cols = new LinkedHashMap<>();
        if (insert) {
            cols.put("ID_PIATTAFORMA", piattaformaIdExpr(piattaforma));
        }
        cols.put("ID_RUOLO", resolveRoleIdForSql(dto.getIdRuolo(), Collections.emptyList(), piattaforma));
        cols.put("PROCESS_KEY", quote(ticket ? "altri" : nullToEmpty(dto.getProcessoVerticale())));
        cols.put("SCIM_CODE", ticket ? quote(nullToEmpty(dto.getCodiceScim())) : "NULL");
        cols.put("PROCESS_VARS", quote(buildProcessVars(dto)));
        return cols;
    }

    private String buildProcessVars(AbilitazioneDTO dto) {
        try {
            return objectMapper.writeValueAsString(new ProcessVarDTO(dto.getCampi(), dto.getComunicazioni()));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("PROCESS_VARS non serializzabile per l'export", e);
        }
    }

    // id piattaforma: reale se esiste, altrimenti subquery su NOME + OBJ_CLASS
    private String piattaformaIdExpr(PiattaformaDTO piattaforma) {
        if (null != piattaforma && null != piattaforma.getId() && piattaforma.getId() > 0) {
            return piattaforma.getId().toString();
        }
        return "(SELECT ID_PIATTAFORMA FROM " + tableName("PIATTAFORMA")
                + " WHERE NOME = " + quote(null == piattaforma ? null : piattaforma.getNome())
                + " AND OBJ_CLASS = " + quote(null == piattaforma ? null : piattaforma.getObjClass()) + ")";
    }

    private String nullToEmpty(String value) {
        return null == value ? "" : value;
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
    private String getPrefissoSchema() {
        if (Arrays.asList(environment.getActiveProfiles()).contains("dev") || !showExportSchema) {
            return "";
        }
        return NOME_SCHEMA + ".";
    }

    private String tableName(String table) {
        return getPrefissoSchema() + table;
    }
}