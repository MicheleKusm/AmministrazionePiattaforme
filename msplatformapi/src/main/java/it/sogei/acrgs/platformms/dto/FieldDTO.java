package it.sogei.acrgs.platformms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FieldDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 4410021882345600003L;

    private Integer order;
    private String name;
    private String inputType;
    private String label;
    private String labelRiepilogo;
    private String description;
    private String apiSource;
    private List<FieldDTO> children;
}
