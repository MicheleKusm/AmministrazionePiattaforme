package it.sogei.acrgs.platformms.controller.rest;

import it.sogei.acrgs.platformms.dto.PersistenceObjectDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static it.sogei.acrgs.platformms.utils.Constants.PERSIST;
import static it.sogei.acrgs.platformms.utils.Constants.PERSISTENCE_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(PERSISTENCE_API)
public class PersistenceController {

     @PostMapping(PERSIST)
     public ResponseEntity persist(PersistenceObjectDTO dto) {
         return ResponseEntity.ok().build();
     }
}
