package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "TIPOLOGICA_CAMPI_DINAMICI", schema = "ACRGS_WEB1")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbilitazioneVerticale {
    @Id
    @Column(name = "ID_ABILITAZIONE_VERTICALE", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "abilitazione_verticale_generator")
    @SequenceGenerator(name = "abilitazione_verticale_generator", sequenceName = "SEQ_ABILITAZIONE_VERTICALE", allocationSize = 1)
    private Long id;

    @Size(max = 255)
    @Column(name = "TYPE", nullable = false)
    private String type;

    @Size(max = 255)
    @Column(name = "REGEX")
    private String regex;

    @Column(name = "ID_TIPO_DATI")
    private Long idTipoDati;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PIATTAFORMA")
    private Piattaforma piattaformaEntity;
}
