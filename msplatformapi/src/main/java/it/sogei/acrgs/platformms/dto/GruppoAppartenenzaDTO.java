package it.sogei.acrgs.platformms.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GruppoAppartenenzaDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 3356315611293840969L;

    private Long id;
    private Long idPiattaforma;

    @Size(max = 255)
    private String nome;

    @Size(max = 300)
    private String descrizione;

    private List<Long> ruoliIds;
}
