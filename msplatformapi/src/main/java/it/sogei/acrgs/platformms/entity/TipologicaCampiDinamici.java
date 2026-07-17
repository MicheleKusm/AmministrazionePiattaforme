package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "TIPOLOGICA_CAMPI_DINAMICI", schema = "ACRGS_WEB1")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipologicaCampiDinamici implements Serializable {

    @Id
    @Column(name = "ID_TIPO_DATI")
    private Long idTipoDati;

    @Size(max = 50)
    @Column(name = "TIPO_DATI", nullable = false)
    private String tipoDati;

    @Size(max = 255)
    @Column(name = "TYPE", nullable = false)
    private String type;

    @Size(max = 255)
    @Column(name = "REGEX")
    private String regex;

}
