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
public class RuoloDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1154258101572695947L;

    private Long id;
    private Long idPiattaforma;
    private boolean richiedibileDaProcesso;
    private boolean daEliminare;
    @Size(max = 255)
    private String nome;

    @Size(max = 255)
    private String descrizione;
}
