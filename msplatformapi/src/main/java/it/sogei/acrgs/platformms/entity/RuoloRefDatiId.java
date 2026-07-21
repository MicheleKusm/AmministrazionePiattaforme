package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class RuoloRefDatiId implements Serializable {
    private static final long serialVersionUID = 8162649143204389594L;
    @NotNull
    @Column(name = "ID_DATI", nullable = false)
    private Long idDati;

    @NotNull
    @Column(name = "ID_RUOLO", nullable = false)
    private Long idRuolo;

    @NotNull
    @Column(name = "ID_PIATTAFORMA", nullable = false)
    private Long idPiattaforma;


}