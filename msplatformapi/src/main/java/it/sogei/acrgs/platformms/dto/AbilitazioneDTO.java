package it.sogei.acrgs.platformms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbilitazioneDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 5540117733455980054L;

    private Long id;
    private Long idPiattaforma;
    private String nome;
    private String tipo;          // TICKET o VERTICALE
    private String riferimento;
    private String stato;
    private String processKey;
    private String codiceScim;
    private String processoVerticale;

    @Builder.Default
    private List<CampoTicketDTO> campi = new ArrayList<>();

    @Builder.Default
    private List<ComunicazioneOnboardingDTO> comunicazioni = new ArrayList<>();
}
