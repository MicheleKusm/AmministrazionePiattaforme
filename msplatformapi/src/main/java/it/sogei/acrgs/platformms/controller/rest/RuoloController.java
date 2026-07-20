package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.RuoloDTO;
import it.sogei.acrgs.platformms.service.RuoloService;
import lombok.RequiredArgsConstructor;
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

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ruoli")
public class RuoloController {

    private final RuoloService ruoloService;

    @GetMapping
    public ResponseEntity<List<RuoloDTO>> list(@RequestParam Long piattaformaId) {
        return ResponseEntity.ok(ruoloService.listByPiattaforma(piattaformaId));
    }

    @PostMapping
    public ResponseEntity<RuoloDTO> create(@RequestBody RuoloDTO dto) {
        return ResponseEntity.ok(ruoloService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RuoloDTO> update(@PathVariable Long id, @RequestBody RuoloDTO dto) {
        return ResponseEntity.ok(ruoloService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ruoloService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
