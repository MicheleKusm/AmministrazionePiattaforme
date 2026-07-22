package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "TIPOLOGICA_CAMPI_DINAMICI")
public class TipologicaCampoDinamico implements Serializable {

    @Serial
    private static final long serialVersionUID = 4520117733455980001L;

    @Id
    @NotNull
    @Size(max = 100)
    @Column(name = "TIPO_DATI", nullable = false, length = 100)
    private String tipoDati;

    @NotNull
    @Size(max = 100)
    @Column(name = "TYPE", nullable = false, length = 100)
    private String type;

    @Size(max = 100)
    @Column(name = "REGEX", length = 100)
    private String regex;

    @Column(name = "ID_TIPO_DATI")
    private Long idTipoDati;
}
