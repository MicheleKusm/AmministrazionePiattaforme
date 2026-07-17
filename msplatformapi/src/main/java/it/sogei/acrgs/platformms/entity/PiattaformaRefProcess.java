package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "PIATTAFORMA_REF_PROCESS")
public class PiattaformaRefProcess {
    @Id
    @Column(name = "ID_PIATTAFORMA_REF_PROCESS", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_PIATTAFORMA", nullable = false)
    private Piattaforma idPiattaforma;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "ID_RUOLO")
    private Ruolo idRuolo;

    @Size(max = 100)
    @NotNull
    @Column(name = "PROCESS_KEY", nullable = false, length = 100)
    private String processKey;

    @Size(max = 4000)
    @NotNull
    @Column(name = "PROCESS_VARS", nullable = false, length = 4000)
    private String processVars;

    @Size(max = 100)
    @Column(name = "SCIM_CODE", length = 100)
    private String scimCode;


}