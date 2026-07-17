package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "GRUPPO_APPARTENENZA_RUOLI")
public class GruppoAppartenenza implements Serializable {

    @Serial
    private static final long serialVersionUID = -5705767017724854640L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_gruppo")
    @SequenceGenerator(name = "seq_gruppo", sequenceName = "SEQ_GRUPPO_DI_APPARTENENZA_RUOLI", allocationSize = 1)
    @Column(name = "ID_GRUPPO_APPARTENENZA")
    private Long id;

    @NotNull
    @Column(name = "ID_PIATTAFORMA", nullable = false)
    private Long idPiattaforma;

    @NotNull
    @Size(max = 255)
    @Column(name = "NOME", nullable = false, length = 255)
    private String nome;

    @NotNull
    @Size(max = 300)
    @Column(name = "DESCRIZIONE", nullable = false, length = 300)
    private String descrizione;
}
