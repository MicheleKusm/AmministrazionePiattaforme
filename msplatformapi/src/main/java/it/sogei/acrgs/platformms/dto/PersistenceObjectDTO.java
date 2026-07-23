package it.sogei.acrgs.platformms.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

public class PersistenceObjectDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 3340817733415180037L;

    private PiattaformaDTO piattaforma;
    private List<RuoloDTO> ruoli;
    private List<GruppoAppartenenzaDTO> gruppiAppartenenza;
    private List<AbilitazioneDTO> abilitazioni;
}
