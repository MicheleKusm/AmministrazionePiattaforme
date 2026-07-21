package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PIATTAFORMA")
public class Piattaforma implements Serializable {

    @Serial
    private static final long serialVersionUID = -5970752049890095218L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_piattaforma")
    @SequenceGenerator(name = "seq_piattaforma", sequenceName = "SEQ_PIATTAFORMA", allocationSize = 1)
    @Column(name = "ID_PIATTAFORMA")
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "DESCRIZIONE", nullable = false)
    private String descrizione;

    @Size(max = 255)
    @NotNull
    @Column(name = "NOME", nullable = false)
    private String nome;

    @Size(max = 255)
    @Column(name = "URL")
    private String url;

    @Size(max = 255)
    @NotNull
    @Column(name = "OBJ_CLASS", nullable = false)
    private String objClass;

    @Size(max = 100)
    @Column(name = "CODICE_ICT", length = 100)
    private String codiceIct;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "RIPETIBILE", nullable = false)
    private Boolean ripetibile;

    @Size(max = 500)
    @Column(name = "CANALE", length = 500)
    private String canale;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "READ_ONLY", nullable = false)
    private Integer readOnly;

    @Size(max = 4000)
    @Column(name = "CONFIG_JSON", length = 4000)
    private String configJson;

    @Column(name = "RICHIEDIBILE_DA_CRUSCOTTO")
    private Long richiedibileDaCruscotto;

    @Column(name = "RICHIEDIBILE_IN_CORSO")
    private Long richiedibileInCorso;

    @ColumnDefault("0")
    @Column(name = "UTILIZZO_MODELLO_AUTORIZZATIVO")
    private Boolean utilizzoModelloAutorizzativo;

}