package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "PIATTAFORMA", uniqueConstraints = {
        @UniqueConstraint(name = "PIATTAFORMA_UNIQUE", columnNames = {"NOME"})
})
public class Piattaforma implements Serializable {
    @Serial
    private static final long serialVersionUID = 6082277364506018656L;
    @Id
    @Column(name = "ID_PIATTAFORMA", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "piattaforma_generator")
    @SequenceGenerator(name = "piattaforma_generator", sequenceName = "SEQ_PIATTAFORMA", allocationSize = 1)
    private Long id;

    @Size(max = 300)
    @NotNull
    @Column(name = "DESCRIZIONE", nullable = false)
    private String descrizione;

    @Size(max = 255)
    @Column(name = "NOME")
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

    @Size(max = 4000)
    @Column(name = "CONFIG_JSON", length = 4000)
    private String configJson;

    @OneToMany(mappedBy = "piattaforma")
    private Set<PiattaformaRefProcess> piattaformaRefProcesses = new LinkedHashSet<>();

    @OneToMany(mappedBy = "piattaforma")
    private Set<Profilo> profili = new LinkedHashSet<>();

    @Size(max = 500)
    @Column(name = "CANALE")
    private String canale;

    @Column(name = "RIPETIBILE")
    private Boolean ripetibile;

    @Column(name = "READ_ONLY")
    private Boolean readOnly;

    @Column(name = "RICHIEDIBILE_DA_CRUSCOTTO")
    private Boolean richiedibileDaCruscotto;

    @Column(name = "RICHIEDIBILE_IN_CORSO")
    private Boolean richiedibileInCorso;

    @OneToMany(mappedBy = "piattaforma")
    private Set<RuoloRefDati> ruoloRefDati = new LinkedHashSet<>();

    public void setupForUpdate(PiattaformaDTO piattaformaDTO) {
        if (Objects.nonNull(piattaformaDTO.getDescrizione())) {
            this.descrizione = piattaformaDTO.getDescrizione();
        }
        if (Objects.nonNull(piattaformaDTO.getNome())) {
            this.nome = piattaformaDTO.getNome();
        }
        if (Objects.nonNull(piattaformaDTO.getUrl())) {
            this.url = piattaformaDTO.getUrl();
        }
        if (Objects.nonNull(piattaformaDTO.getObjClass())) {
            this.objClass = piattaformaDTO.getObjClass();
        }
        if (Objects.nonNull(piattaformaDTO.getCodiceIct())) {
            this.codiceIct = piattaformaDTO.getCodiceIct();
        }
        if (Objects.nonNull(piattaformaDTO.getCanale())) {
            this.canale = piattaformaDTO.getCanale();
        }
        if (Objects.nonNull(piattaformaDTO.getRipetibile())) {
            this.ripetibile = piattaformaDTO.getRipetibile();
        }
        if (Objects.nonNull(piattaformaDTO.getReadOnly())) {
            this.readOnly = piattaformaDTO.getReadOnly();
        }
        if (Objects.nonNull(piattaformaDTO.getConfigJson())) {
            this.configJson = piattaformaDTO.getConfigJson();
        }
    }
}