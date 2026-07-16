package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.PlatformDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/platforms")
public class PlatformController {

    @GetMapping
    public ResponseEntity<List<PlatformDto>> getPlatforms(@RequestParam(defaultValue = "") String search) {
        PlatformDto sample = new PlatformDto(
                1L,
                "PCC",
                "Piattaforma di Interscambio Credit Commerciale NGS",
                "https://pcc.rgs.mef.gov.it",
                "PORTALE",
                "pccPlatform",
                "PCC_NGS",
                "oam:clientId",
                "pcc-client-ngs",
                true,
                false,
                true,
                true,
                true
        );
        if (!search.isBlank() && !sample.nome().toLowerCase().contains(search.toLowerCase())) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(List.of(sample));
    }
}
