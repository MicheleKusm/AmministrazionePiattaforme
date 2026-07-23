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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SectionDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 4410021882345600002L;

    private String header;

    private String subheader;

    @JsonProperty("role_groups")
    private List<Long> roleGroups;
}
