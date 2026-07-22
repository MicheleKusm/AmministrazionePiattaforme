package it.sogei.acrgs.platformms.dto;

import jakarta.validation.constraints.Size;
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
public class ProcessVarDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private List<CampoTicketDTO> inputs;

    private List<ComunicazioneOnboardingDTO> onboarding;
}
