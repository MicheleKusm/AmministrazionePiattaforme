package it.sogei.acrgs.platformms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilityToolDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 2240327733455984321L;

    private Long id;
    private String name;
    private String type;
    private String additionalInfo;
}
