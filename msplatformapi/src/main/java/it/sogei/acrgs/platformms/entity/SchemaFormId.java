package it.sogei.acrgs.platformms.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class SchemaFormId implements Serializable {

    private static final long serialVersionUID = 7712553390442310010L;

    private Long idPiattaforma;
    private String processKey;
    private String key;
}
