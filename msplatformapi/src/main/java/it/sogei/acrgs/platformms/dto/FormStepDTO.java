package it.sogei.acrgs.platformms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * Un singolo step del cruscotto dinamico (CONFIG_JSON v2), allineato a
 * anag-commons ConfigFormDTO.FormStepDTO. Serializzato dentro PIATTAFORMA.CONFIG_JSON
 * sotto la chiave "formSteps".
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormStepDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 4410021882345600001L;

    private String step;

    private String descrizione;

    @JsonProperty("role_groups")
    private List<Long> roleGroups;

    private List<SectionDTO> sections;
}
