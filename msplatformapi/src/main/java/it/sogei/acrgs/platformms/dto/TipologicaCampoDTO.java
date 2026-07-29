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
public class TipologicaCampoDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 2240117733455980021L;

    private String tipoDati;
    private String type;
    private String regex;
    private Long idTipoDati;
    private String apiSource;
    private String label;
}
