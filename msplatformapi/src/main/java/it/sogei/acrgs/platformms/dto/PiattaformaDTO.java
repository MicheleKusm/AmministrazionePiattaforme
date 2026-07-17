package it.sogei.acrgs.platformms.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PiattaformaDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = -7018824416171345087L;
    private Long id;
    @Size(max = 255)
    private String descrizione;
    @Size(max = 255)
    private String nome;
    @Size(max = 255)
    private String url;
    @Size(max = 255)
    private String objClass;
    @Size(max = 100)
    private String codiceIct;
    @Size(max = 500)
    private String canale;
    @Size(max = 4000)
    private String configJson;
    private Boolean ripetibile;
    private Boolean readOnly;
    private Boolean richiedibileDaCruscotto;
    private Boolean richiedibileInCorso;
    private Boolean utilizzoModelloAutorizzativo;
}

