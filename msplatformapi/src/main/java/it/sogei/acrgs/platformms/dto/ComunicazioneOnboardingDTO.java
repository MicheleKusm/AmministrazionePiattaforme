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
public class ComunicazioneOnboardingDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 4440117733455980043L;

    private Long id;
    private String icona;
    private String testo;
    private boolean obbligatoria;
}
