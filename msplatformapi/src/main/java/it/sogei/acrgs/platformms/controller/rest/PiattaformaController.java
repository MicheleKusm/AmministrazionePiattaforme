package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.CustomPaginatedResponseDTO;
import it.sogei.acrgs.platformms.dto.FormStepDTO;
import it.sogei.acrgs.platformms.dto.PiattaformaDTO;
import it.sogei.acrgs.platformms.service.PiattaformaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static it.sogei.acrgs.platformms.utils.Constants.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/piattaforme")
public class PiattaformaController {

    private final PiattaformaService piattaformaService;

    @GetMapping
    public ResponseEntity<CustomPaginatedResponseDTO<PiattaformaDTO>> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(CustomPaginatedResponseDTO.from(piattaformaService.list(search, page, size)));
    }

    @PostMapping(VALIDAZIONE_INIZIALE_PIATTAFORMA)
    public ResponseEntity<List<String>> validate(@RequestBody PiattaformaDTO dto) {
        return ResponseEntity.ok(piattaformaService.validaPiattaformaNomeAndObjclass(dto));
    }

    @GetMapping(ID)
    public ResponseEntity<PiattaformaDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(piattaformaService.get(id));
    }

    @GetMapping(ID + CRUSCOTTO)
    public ResponseEntity<List<FormStepDTO>> getCruscotto(@PathVariable Long id) {
        return ResponseEntity.ok(piattaformaService.getCruscotto(id));
    }

    @PostMapping
    public ResponseEntity<PiattaformaDTO> create(@RequestBody PiattaformaDTO dto) {
        return ResponseEntity.ok(piattaformaService.create(dto));
    }

    @PutMapping(ID)
    public ResponseEntity<PiattaformaDTO> update(@PathVariable Long id, @RequestBody PiattaformaDTO dto) {
        return ResponseEntity.ok(piattaformaService.update(id, dto));
    }

    @DeleteMapping(ID)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        piattaformaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
