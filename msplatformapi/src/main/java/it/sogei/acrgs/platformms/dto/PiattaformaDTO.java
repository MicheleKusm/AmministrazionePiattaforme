package it.sogei.acrgs.platformms.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PiattaformaDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 3482677254725443697L;

    private Long id;

    @Size(max = 255)
    private String nome;

    @Size(max = 255)
    private String descrizione;

    @Size(max = 255)
    private String url;

    @Size(max = 500)
    private String canale;

    @Size(max = 255)
    private String objClass;

    private Boolean readOnly;

    @Size(max = 100)
    private String codiceIct;

    @Size(max = 255)
    private String oamMetadataName;

    @Size(max = 255)
    private String oamMetadataValue;

    private Boolean richiedibileDaCruscotto;
    private Boolean richiedibileInCorso;
    private Boolean ripetibile;
    private Boolean utilizzoModelloAutorizzativo;
}
