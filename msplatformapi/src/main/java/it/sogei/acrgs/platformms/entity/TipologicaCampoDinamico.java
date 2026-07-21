package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "TIPOLOGICA_CAMPI_DINAMICI")
public class TipologicaCampoDinamico implements Serializable {

    @Serial
    private static final long serialVersionUID = 4520117733455980001L;

    @Id
    @Column(name = "TIPO_DATI", nullable = false, length = 100)
    private String tipoDati;

    @Column(name = "\"TYPE\"", length = 100)
    private String type;

    @Column(name = "REGEX", length = 100)
    private String regex;

    @Column(name = "ID_TIPO_DATI")
    private Long idTipoDati;
}
