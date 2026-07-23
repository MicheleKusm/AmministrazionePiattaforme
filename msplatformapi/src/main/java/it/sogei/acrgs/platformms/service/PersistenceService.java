package it.sogei.acrgs.platformms.service;

import it.sogei.acrgs.platformms.dto.PersistenceObjectDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersistenceService {

    public List<String> persist (PersistenceObjectDTO persistenceObjectDTO) {
        List<String> errors = new ArrayList<>();

        return errors;
    }
}
