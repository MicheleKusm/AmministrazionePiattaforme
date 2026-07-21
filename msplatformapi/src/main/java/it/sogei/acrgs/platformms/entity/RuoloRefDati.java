package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "RUOLO_REF_DATI")
public class RuoloRefDati implements Serializable {
    @EmbeddedId
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_ruolo_ref_dati")
    @SequenceGenerator(name = "seq_ruolo_ref_dati", sequenceName = "SEQ_RUOLO_REF_DATI", allocationSize = 1)
    @Column(name = "ID_RUOLO_REF_DATI")
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