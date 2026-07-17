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
    private static final long serialVersionUID = 1705589902821418056L;
    private Long id;
    @Size(max = 255)
    private String nome;
    private Boolean richiedibileDaProcesso;
    @Size(max = 255)
    private String descrizione;
    private Long idPiattaforma;
}

