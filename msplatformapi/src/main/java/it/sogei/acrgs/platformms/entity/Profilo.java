package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PROFILO")
public class Profilo {
    @Id
    @Column(name = "ID_PROFILO", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profilo_generator")
    @SequenceGenerator(name = "profilo_generator", sequenceName = "SEQ_PROFILO", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "DATA_ATTIVAZIONE", nullable = false)
    private LocalDate dataAttivazione;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_RUOLO")
    private Ruolo idRuolo;

    @Column(name = "DATA_DISATTIVAZIONE")
    private LocalDate dataDisattivazione;

    @Size(max = 100)
    @NotNull
    @Column(name = "STATO", nullable = false, length = 100)
    private String stato;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PIATTAFORMA", nullable = false)
    private Piattaforma idPiattaforma;

    @Size(max = 36)
    @Column(name = "UNIQUE_ID", length = 36)
    private String uniqueId;

    @Size(max = 100)
    @Column(name = "METADATI_GEN_KEY", length = 100)
    private String metadatiGenKey;

    @Size(max = 50)
    @Column(name = "PROCESS_INSTANCE_ID", length = 50)
    private String processInstanceId;


}