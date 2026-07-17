package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.PiattaformaDTO;
import it.sogei.acrgs.platformms.service.PiattaformaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/piattaforme")
public class PiattaformaController {

    private final PiattaformaService piattaformaService;

    @GetMapping
    public ResponseEntity<Page<PiattaformaDTO>> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(piattaformaService.list(search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PiattaformaDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(piattaformaService.get(id));
    }

    @PostMapping
    public ResponseEntity<PiattaformaDTO> create(@RequestBody PiattaformaDTO dto) {
        return ResponseEntity.ok(piattaformaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PiattaformaDTO> update(@PathVariable Long id, @RequestBody PiattaformaDTO dto) {
        return ResponseEntity.ok(piattaformaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        piattaformaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
