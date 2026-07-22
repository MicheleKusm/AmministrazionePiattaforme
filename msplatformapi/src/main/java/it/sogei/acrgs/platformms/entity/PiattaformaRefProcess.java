package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PIATTAFORMA_REF_PROCESS")
public class PiattaformaRefProcess implements Serializable {

    @Serial
    private static final long serialVersionUID = 6640117733455980065L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_piattaforma_ref_process")
    @SequenceGenerator(name = "seq_piattaforma_ref_process", sequenceName = "SEQ_PIATTAFORMA_REF_PROCESS", allocationSize = 1)
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
