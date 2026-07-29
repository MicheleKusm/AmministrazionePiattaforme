package it.sogei.acrgs.platformms.utils;

import it.sogei.acrgs.platformms.dto.ComunicazioneOnboardingDTO;

import java.util.List;

import static it.sogei.acrgs.platformms.utils.Constants.SEP_ICONA;

public class Utility {
    public boolean convertToBoolean(Integer value) {
        return value != null && value == 1;
    }

    public boolean convertToBoolean(Long value) {
        return value != null && value == 1;
    }

    public Integer convertToInteger(Boolean value) {
        return value != null && !value ? 1 : 0;
    }

    public static void mergeIcona(List<ComunicazioneOnboardingDTO> comunicazioni) {
        if (comunicazioni == null) {
            return;
        }
        for (ComunicazioneOnboardingDTO comunicazione : comunicazioni) {
            if (comunicazione == null || comunicazione.getIcona() == null || comunicazione.getIcona().isBlank()) {
                continue;
            }
            if (comunicazione.getTypeIcona() != null && !comunicazione.getTypeIcona().isBlank()) {
                comunicazione.setIcona(comunicazione.getIcona().trim().toLowerCase() + SEP_ICONA + comunicazione.getTypeIcona().trim().toLowerCase());
            }
            comunicazione.setTypeIcona(null);
        }
    }
}
