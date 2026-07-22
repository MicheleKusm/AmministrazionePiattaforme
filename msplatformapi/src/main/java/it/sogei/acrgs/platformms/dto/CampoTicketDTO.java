package it.sogei.acrgs.platformms.dto;

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
public class CampoTicketDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 3340117733455980032L;

    private Long id;
    private String label;
    private String descrizione;
    private String key;
    private String inputType;
    private boolean required;
    private String regex;
    private String cssClass;
    private Long idTipoDato;
    private Integer order;
}
