package it.sogei.acrgs.platformms.dto;

public record PlatformDto(
        Long id,
        String nome,
        String descrizione,
        String url,
        String canale,
        String objClass,
        String codiceIct,
        String oamMetadataName,
        String oamMetadataValue,
        boolean richiedibileDaCruscotto,
        boolean readOnly,
        boolean richiedibileInCorso,
        boolean ripetibile,
        boolean utilizzoModelloAutorizzativo
) {
}
