package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "RUOLO_REF_DATI")
public class RuoloRefDati {
    @EmbeddedId
    private RuoloRefDatiId id;

    @MapsId("idRuolo")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_RUOLO", nullable = false)
    private Ruolo idRuolo;

    @MapsId("idPiattaforma")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PIATTAFORMA", nullable = false)
    private Piattaforma idPiattaforma;


}