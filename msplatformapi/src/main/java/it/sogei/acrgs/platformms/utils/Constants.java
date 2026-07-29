package it.sogei.acrgs.platformms.utils;

import java.util.List;

public class Constants {
    public static final String OAM_METADATA_NAME = "msso_metadata_name";
    public static final String OAM_METADATA_VALUE = "msso_metadata_value";
    public static final String OAM_METADATA = "oamMetadata";
    public static final String CODICE_ICT = "codiceIct";
    public static final String OAMMETADATANAME = "oamMetadataName";
    public static final String OAMMETADATAVALUE = "oamMetadataValue";
    public static final String RICHIEDIBILE_DA_CRUSCOTTO = "richiedibileDaCruscotto";
    public static final String RICHIEDIBILE_IN_CORSO = "richiedibileInCorso";
    public static final String RIPETIBILE = "ripetibile";
    public static final String UTILIZZO_MODELLO_AUTORIZZATIVO = "utilizzoModelloAutorizzativo";
    public static final String ROLE_GROUPS = "role_groups";
    public static final String CRUSCOTTO_PIATTAFORMA = "CRUSCOTTO PER PIATTAFORMA";
    public static final String FORM_STEPS = "formSteps";
    public static final String SEP_ICONA = "-";
    public static final String PROCESS_KEY_TICKET = "altri";
    public static final String TIPO_TICKET = "TICKET";
    public static final String TIPO_VERTICALE = "VERTICALE";
    public static final String STATO_ATTIVA = "Attiva";
    //url const
    public static final String CRUSCOTTO = "/cruscotto";
    public static final String ID = "/{id}";
    public static final String ALL = "/all";
    public static final String PERSIST = "/persist";
    public static final String DEPENDENCIES = "/dependencies";
    public static final String NA = "N/A";
    public static final String RUOLO = "RUOLO";
    //api
    public static final String GRUPPI_API = "/api/gruppi";
    public static final String PERSISTENCE_API = "api/persistence";
    public static final String VALIDAZIONE_INIZIALE_PIATTAFORMA = "/validazioneInitPiattaforma";
    public static final List<String> ICONE = List.of("business_center", "description", "files", "mail", "summarize");
    public static final String EXPORT = "/export";
    //regex
    public static final String REGEX_NOMI = "^[a-zA-Z0-9_ ,.#-]+$";
    public static final String REGEX_DESCRIZIONI = "^[^<>&]+$";
    //sql
    public static final String TABLE_PIATTAFORMA = "PIATTAFORMA";
    public static final String TABLE_RUOLO = "RUOLO";
    public static final String TABLE_GRUPPO_APPARTENENZA = "GRUPPO_APPARTENENZA_RUOLI";
    public static final String SEQ_PIATTAFORMA = "SEQ_PIATTAFORMA";
    public static final String SEQ_RUOLO = "SEQ_RUOLO";
    public static final String SEQ_GRUPPO = "SEQ_GRUPPO_DI_APPARTENENZA_RUOLI";
    public static final String COL_ID_PIATTAFORMA = "ID_PIATTAFORMA";
    public static final String COL_ID_RUOLO = "ID_RUOLO";
    public static final String COL_ID_GRUPPO = "ID_GRUPPO_APPARTENENZA";
    public static final String TABLE_PIATTAFORMA_REF_PROCESS = "PIATTAFORMA_REF_PROCESS";
    public static final String SEQ_PIATTAFORMA_REF_PROCESS = "SEQ_PIATTAFORMA_REF_PROCESS";
    public static final String COL_ID_PIATTAFORMA_REF_PROCESS = "ID_PIATTAFORMA_REF_PROCESS";
    // export
    public static final String NOME_SCHEMA = "ANAGRAFICA_RGS";
    public static final String GRUPPI_SQL_FILENAME = "gruppi.sql";
    public static final String PIATTAFORMA_SQL_FILENAME = "piattaforma.sql";
    public static final String RUOLI_SQL_FILENAME = "ruoli.sql";
    public static final String RUOLI_REF_APPARTENENZA_SQL_FILENAME = "ruoli_ref_appartenenza.sql";
    public static final String ABILITAZIONI_SQL_FILENAME = "abilitazioni.sql";
}
