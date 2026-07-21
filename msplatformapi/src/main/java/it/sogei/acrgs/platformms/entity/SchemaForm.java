package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
@IdClass(SchemaFormId.class)
@Table(name = "SCHEMI_FORM")
public class SchemaForm implements Serializable {

    @Serial
    private static final long serialVersionUID = 5540117733455980077L;

    @Id
    @Column(name = "ID_PIATTAFORMA", nullable = false)
    private Long idPiattaforma;

    @Id
    @Column(name = "PROCESS_KEY", nullable = false, length = 100)
    private String processKey;

    @Id
    @Column(name = "\"KEY\"", nullable = false, length = 50)
    private String key;

    @Column(name = "LABEL", nullable = false, length = 200)
    private String label;

    @Column(name = "ID_TIPO_DATO", nullable = false)
    private Long idTipoDato;

    @Column(name = "REQUIRED", nullable = false)
    private Integer required;

    @Column(name = "INPUT_TYPE", nullable = false, length = 50)
    private String inputType;
}
