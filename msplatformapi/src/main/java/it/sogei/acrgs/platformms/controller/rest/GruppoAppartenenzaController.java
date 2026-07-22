package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.GruppoAppartenenzaDTO;
import it.sogei.acrgs.platformms.dto.GruppoDependenciesDTO;
import it.sogei.acrgs.platformms.service.GruppoAppartenenzaService;
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

import static it.sogei.acrgs.platformms.utils.Constants.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(GRUPPI_API)
public class GruppoAppartenenzaController {

    private final GruppoAppartenenzaService gruppoService;

    @GetMapping(ALL_API)
    public ResponseEntity<List<GruppoAppartenenzaDTO>> list() {
        return ResponseEntity.ok(gruppoService.list());
    }

    @PostMapping
    public ResponseEntity<GruppoAppartenenzaDTO> create(@RequestBody GruppoAppartenenzaDTO dto) {
        return ResponseEntity.ok(gruppoService.create(dto));
    }

    @GetMapping(ID_API + DEPENDENCIES_API)
    public ResponseEntity<GruppoDependenciesDTO> getDependencies(@PathVariable Long id) {
        return ResponseEntity.ok(gruppoService.getDependencies(id));
    }

    @PutMapping(ID_API)
    public ResponseEntity<GruppoAppartenenzaDTO> update(@PathVariable Long id, @RequestBody GruppoAppartenenzaDTO dto) {
        return ResponseEntity.ok(gruppoService.update(id, dto));
    }

    @DeleteMapping(ID_API)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gruppoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
