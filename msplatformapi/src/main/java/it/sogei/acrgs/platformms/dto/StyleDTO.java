package it.sogei.acrgs.platformms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StyleDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 4410021882345600004L;

    private String layout;
    private Boolean bordered;
    private Boolean dividers;
}