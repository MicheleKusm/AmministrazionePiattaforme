package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.AbilitazioneDTO;
import it.sogei.acrgs.platformms.dto.TipologicaCampoDTO;
import it.sogei.acrgs.platformms.service.AbilitazioneService;
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
@RequestMapping("/api/abilitazioni")
public class AbilitazioneController {

    private final AbilitazioneService abilitazioneService;

    @GetMapping
    public ResponseEntity<List<AbilitazioneDTO>> list(@RequestParam Long piattaformaId) {
        return ResponseEntity.ok(abilitazioneService.listByPiattaforma(piattaformaId));
    }

    @GetMapping("/tipologiche")
    public ResponseEntity<List<TipologicaCampoDTO>> tipologiche() {
        return ResponseEntity.ok(abilitazioneService.listTipologiche());
    }

    @GetMapping("/processi")
    public ResponseEntity<List<String>> processi() {
        return ResponseEntity.ok(abilitazioneService.listProcessiVerticali());
    }

    @PostMapping
    public ResponseEntity<AbilitazioneDTO> create(@RequestBody AbilitazioneDTO dto) {
        return ResponseEntity.ok(abilitazioneService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AbilitazioneDTO> update(@PathVariable Long id, @RequestBody AbilitazioneDTO dto) {
        return ResponseEntity.ok(abilitazioneService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        abilitazioneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
