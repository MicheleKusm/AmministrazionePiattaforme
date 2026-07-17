package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "RUOLO")
public class Ruolo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1705589902821418056L;

    @Id
    @Column(name = "ID_RUOLO", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ruolo_generator")
    @SequenceGenerator(name = "ruolo_generator", sequenceName = "SEQ_RUOLO", allocationSize = 1)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "NOME", nullable = false)
    private String nome;

    @Size(max = 255)
    @Column(name = "DESCRIZIONE")
    private String descrizione;

    @Column(name = "RICHIEDIBILE_DA_PROCESSO")
    private Boolean richiedibileDaProcesso;

    @NotNull
    @Column(name = "ID_PIATTAFORMA", nullable = false)
    private Long idPiattaforma;

    //    @ManyToOne(fetch = FetchType.LAZY)
    //    @JoinColumn(name = "ID_PIATTAFORMA", insertable = false, updatable = false)
    //    private PiattaformaEntity piattaforma;

    //    @ManyToMany(mappedBy = "ruoli")
    //    private Set<GruppoAppartenenzaEntity> gruppiAppartenenza = new LinkedHashSet<>();
}