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
public class AbilitazioneVerticaleDTO implements Serializable{
        @Serial
        private static final long serialVersionUID = 1705589902821418056L;
        private Long id;
        private String nome;
        private Boolean richiedibileDaProcesso;
        @Size(max = 255)
        private String descrizione;
        private Long idPiattaforma;
    }
