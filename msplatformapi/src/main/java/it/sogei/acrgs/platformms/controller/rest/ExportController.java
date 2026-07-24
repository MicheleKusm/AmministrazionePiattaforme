package it.sogei.acrgs.platformms.controller.rest;
import it.sogei.acrgs.platformms.dto.PersistenceObjectDTO;
import it.sogei.acrgs.platformms.service.ExportService;
import it.sogei.acrgs.platformms.exceptions.ExportException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static it.sogei.acrgs.platformms.utils.Constants.EXPORT;
import static it.sogei.acrgs.platformms.utils.Constants.PERSISTENCE_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(PERSISTENCE_API)
public class ExportController {

    private final ExportService exportService;

    @PostMapping(EXPORT)
    public ResponseEntity<?> export(@RequestBody PersistenceObjectDTO dto) {
        try {
            byte[] zipData = exportService.exportSqlZip(dto);
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"export.zip\"").contentType(MediaType.APPLICATION_OCTET_STREAM).body(zipData);
        } catch (ExportException exception) {
            return ResponseEntity.badRequest().contentType(MediaType.TEXT_PLAIN).body("ERROR:\n" + String.join("\n", exception.getErrors()));
        }
    }
}