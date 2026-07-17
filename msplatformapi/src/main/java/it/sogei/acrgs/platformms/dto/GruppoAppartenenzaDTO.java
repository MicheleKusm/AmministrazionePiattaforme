package it.sogei.acrgs.platformms.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
public class GruppoAppartenenzaDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 6590168389251915981L;

    private Long id;
    @Size(max = 100)
    private String categoria;
    @Size(max = 300)
    private String descrizione;
    private List<RuoloDTO> ruoli;
}

