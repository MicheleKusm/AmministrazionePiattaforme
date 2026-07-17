package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "GRUPPO_APPARTENENZA_RUOLI")
public class GruppoAppartenenza implements Serializable {

    @Serial
    private static final long serialVersionUID = 6590168389251915981L;

    @Id
    @Column(name = "ID_GRUPPO_APPARTENENZA", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gruppo_appartenenza_generator")
    @SequenceGenerator(name = "gruppo_appartenenza_generator", sequenceName = "SEQ_GRUPPO_APPARTENENZA", allocationSize = 1)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "CATEGORIA", nullable = false)
    private String categoria;

    @Size(max = 300)
    @Column(name = "DESCRIZIONE")
    private String descrizione;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "RUOLI_REF_APPARTENENZA",
            joinColumns = @JoinColumn(name = "ID_GRUPPO_APPARTENENZA"),
            inverseJoinColumns = @JoinColumn(name = "ID_RUOLO")
    )
    private Set<Ruolo> ruoli = new LinkedHashSet<>();
}