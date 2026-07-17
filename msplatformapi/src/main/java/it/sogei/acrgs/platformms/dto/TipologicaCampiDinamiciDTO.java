package it.sogei.acrgs.platformms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.Size;
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
public class TipologicaCampiDinamiciDTO implements Serializable {
    @Size(max = 50)
    private String tipoDati;
    @Size(max = 255)
    private String type;
    @Size(max = 255)
    private String regex;
    private Long idTipoDati;
}