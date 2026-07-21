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
@Table(name = "PIATTAFORMA")
public class Piattaforma implements Serializable {

    @Serial
    private static final long serialVersionUID = -5970752049890095218L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_piattaforma")
    @SequenceGenerator(name = "seq_piattaforma", sequenceName = "SEQ_PIATTAFORMA", allocationSize = 1)
    @Column(name = "ID_PIATTAFORMA")
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "NOME", nullable = false, length = 255, unique = true)
    private String nome;

    @NotNull
    @Size(max = 255)
    @Column(name = "DESCRIZIONE", nullable = false, length = 255)
    private String descrizione;

    @Size(max = 255)
    @Column(name = "URL", length = 255)
    private String url;

    @Size(max = 500)
    @Column(name = "CANALE", length = 500)
    private String canale;

    @NotNull
    @Size(max = 255)
    @Column(name = "OBJ_CLASS", nullable = false, length = 255)
    private String objClass;

    @Column(name = "READ_ONLY", nullable = false)
    private Integer readOnly;

    @Size(max = 4000)
    @Column(name = "CONFIG_JSON", length = 4000)
    private String configJson;

    //TODO aggiungere nuova colona utilizzoModelloAutorizzativo integer
}
