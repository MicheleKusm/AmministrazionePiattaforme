package it.sogei.acrgs.platformms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import it.sogei.acrgs.platformms.dto.AbilitazioneDTO;
import it.sogei.acrgs.platformms.dto.CampoTicketDTO;
import it.sogei.acrgs.platformms.dto.ComunicazioneOnboardingDTO;
import it.sogei.acrgs.platformms.dto.TipologicaCampoDTO;
import it.sogei.acrgs.platformms.entity.Piattaforma;
import it.sogei.acrgs.platformms.entity.PiattaformaRefProcess;
import it.sogei.acrgs.platformms.entity.SchemaForm;
import it.sogei.acrgs.platformms.entity.TipologicaCampoDinamico;
import it.sogei.acrgs.platformms.repository.PiattaformaRefProcessRepository;
import it.sogei.acrgs.platformms.repository.PiattaformaRepository;
import it.sogei.acrgs.platformms.repository.SchemaFormRepository;
import it.sogei.acrgs.platformms.repository.TipologicaCampoDinamicoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AbilitazioneService {

    private static final String TIPO_TICKET = "TICKET";
    private static final String TIPO_VERTICALE = "VERTICALE";
    private static final String PROCESS_KEY_TICKET = "ALTRI";
    private static final String STATO_ATTIVA = "Attiva";
    private static final String KEY_COMUNICAZIONI = "comunicazioni";
    private static final String KEY_CAMPI_EXTRA = "campiExtra";

    private final PiattaformaRefProcessRepository refProcessRepository;
    private final SchemaFormRepository schemaFormRepository;
    private final TipologicaCampoDinamicoRepository tipologicaRepository;
    private final PiattaformaRepository piattaformaRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<AbilitazioneDTO> listByPiattaforma(Long idPiattaforma) {
        Piattaforma piattaforma = piattaformaRepository.findById(idPiattaforma).orElseThrow();
        Map<Long, TipologicaCampoDinamico> tipologicheById = tipologicheById();
        return refProcessRepository.findByIdPiattaforma_Id(idPiattaforma).stream()
                .map(ref -> toDto(ref, piattaforma, tipologicheById))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TipologicaCampoDTO> listTipologiche() {
        return tipologicaRepository.findAll().stream()
                .map(t -> TipologicaCampoDTO.builder()
                        .tipoDati(t.getTipoDati())
                        .type(t.getType())
                        .regex(t.getRegex())
                        .idTipoDati(t.getIdTipoDati())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> listProcessiVerticali() {
        return refProcessRepository.findDistinctProcessKeys(PROCESS_KEY_TICKET);
    }

    @Transactional
    public AbilitazioneDTO create(AbilitazioneDTO dto) {
        Piattaforma piattaforma = piattaformaRepository.findById(dto.getIdPiattaforma()).orElseThrow();
        PiattaformaRefProcess ref = new PiattaformaRefProcess();
        ref.setIdPiattaforma(piattaforma);
        applyDto(ref, piattaforma, dto);
        ref = refProcessRepository.save(ref);
        return toDto(ref, piattaforma, tipologicheById());
    }

    @Transactional
    public AbilitazioneDTO update(Long id, AbilitazioneDTO dto) {
        PiattaformaRefProcess ref = refProcessRepository.findById(id).orElseThrow();
        Piattaforma piattaforma = ref.getIdPiattaforma();
        // il tipo/processo può cambiare: ripulisco i campi legati alla vecchia process key
        schemaFormRepository.deleteByIdPiattaformaAndProcessKey(piattaforma.getId(), ref.getProcessKey());
        applyDto(ref, piattaforma, dto);
        ref = refProcessRepository.save(ref);
        return toDto(ref, piattaforma, tipologicheById());
    }

    @Transactional
    public void delete(Long id) {
        PiattaformaRefProcess ref = refProcessRepository.findById(id).orElseThrow();
        schemaFormRepository.deleteByIdPiattaformaAndProcessKey(ref.getIdPiattaforma().getId(), ref.getProcessKey());
        refProcessRepository.delete(ref);
    }

    // ---------- scrittura ----------

    private void applyDto(PiattaformaRefProcess ref, Piattaforma piattaforma, AbilitazioneDTO dto) {
        boolean ticket = TIPO_TICKET.equalsIgnoreCase(dto.getTipo());
        String processKey = ticket ? PROCESS_KEY_TICKET : nullToEmpty(dto.getProcessoVerticale());

        // costruisco i campi (solo ticket) con le loro chiavi univoche
        Map<String, CampoTicketDTO> campiByKey = new LinkedHashMap<>();
        List<SchemaForm> schemi = new ArrayList<>();
        if (ticket && dto.getCampi() != null) {
            Map<String, TipologicaCampoDinamico> tipologicheByTipoDati = tipologicaRepository.findAll().stream()
                    .collect(Collectors.toMap(TipologicaCampoDinamico::getTipoDati, Function.identity(), (a, b) -> a));
            int progressivo = 0;
            for (CampoTicketDTO campo : dto.getCampi()) {
                progressivo++;
                String key = uniqueKey(buildKey(campo.getLabel(), campo.getCampo(), progressivo), campiByKey.keySet());
                TipologicaCampoDinamico tip = tipologicheByTipoDati.get(campo.getCampo());
                SchemaForm schema = new SchemaForm();
                schema.setIdPiattaforma(piattaforma.getId());
                schema.setProcessKey(processKey);
                schema.setKey(key);
                schema.setLabel(nullToEmpty(campo.getLabel()));
                schema.setIdTipoDato(tip != null && tip.getIdTipoDati() != null ? tip.getIdTipoDati() : 0L);
                schema.setRequired(campo.isObbligatoria() ? 1 : 0);
                schema.setInputType(nullToEmpty(campo.getTipoValore()));
                schemi.add(schema);
                campiByKey.put(key, campo);
            }
        }

        ref.setProcessKey(processKey);
        ref.setScimCode(ticket ? dto.getCodiceScim() : null);
        ref.setProcessVars(buildProcessVars(dto.getComunicazioni(), campiByKey));

        // riscrivo i campi della nuova process key (delete + flush + insert per evitare conflitti di PK)
        schemaFormRepository.deleteByIdPiattaformaAndProcessKey(piattaforma.getId(), processKey);
        schemaFormRepository.flush();
        if (!schemi.isEmpty()) {
            schemaFormRepository.saveAll(schemi);
        }
    }

    private String buildProcessVars(List<ComunicazioneOnboardingDTO> comunicazioni, Map<String, CampoTicketDTO> campiByKey) {
        ObjectNode root = objectMapper.createObjectNode();
        ArrayNode arr = root.putArray(KEY_COMUNICAZIONI);
        if (comunicazioni != null) {
            for (ComunicazioneOnboardingDTO c : comunicazioni) {
                ObjectNode node = arr.addObject();
                node.put("canale", nullToEmpty(c.getCanale()));
                node.put("descrizione", nullToEmpty(c.getDescrizione()));
                node.put("obbligatoria", c.isObbligatoria());
            }
        }
        ObjectNode extra = root.putObject(KEY_CAMPI_EXTRA);
        for (Map.Entry<String, CampoTicketDTO> entry : campiByKey.entrySet()) {
            ObjectNode node = extra.putObject(entry.getKey());
            node.put("descrizione", nullToEmpty(entry.getValue().getDescrizione()));
            node.put("regex", nullToEmpty(entry.getValue().getRegex()));
        }
        try {
            return objectMapper.writeValueAsString(root);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("PROCESS_VARS non serializzabile", ex);
        }
    }

    // ---------- lettura ----------

    private AbilitazioneDTO toDto(PiattaformaRefProcess ref, Piattaforma piattaforma, Map<Long, TipologicaCampoDinamico> tipologicheById) {
        boolean ticket = PROCESS_KEY_TICKET.equalsIgnoreCase(ref.getProcessKey());
        String tipo = ticket ? TIPO_TICKET : TIPO_VERTICALE;
        JsonNode processVars = readProcessVars(ref.getProcessVars());
        JsonNode campiExtra = processVars.path(KEY_CAMPI_EXTRA);

        List<CampoTicketDTO> campi = new ArrayList<>();
        if (ticket) {
            long index = 1;
            for (SchemaForm schema : schemaFormRepository.findByIdPiattaformaAndProcessKey(piattaforma.getId(), ref.getProcessKey())) {
                campi.add(toCampoDto(schema, tipologicheById, campiExtra, index++));
            }
        }

        String riferimento = ticket ? nullToEmpty(ref.getScimCode()) : nullToEmpty(ref.getProcessKey());
        return AbilitazioneDTO.builder()
                .id(ref.getId())
                .idPiattaforma(piattaforma.getId())
                .nome(buildNome(ticket, piattaforma.getNome(), ref.getProcessKey()))
                .tipo(tipo)
                .riferimento(riferimento)
                .stato(STATO_ATTIVA)
                .processKey(ref.getProcessKey())
                .codiceScim(ticket ? nullToEmpty(ref.getScimCode()) : "")
                .processoVerticale(ticket ? "" : nullToEmpty(ref.getProcessKey()))
                .campi(campi)
                .comunicazioni(parseComunicazioni(processVars))
                .build();
    }

    private CampoTicketDTO toCampoDto(SchemaForm schema, Map<Long, TipologicaCampoDinamico> tipologicheById, JsonNode campiExtra, long index) {
        TipologicaCampoDinamico tip = schema.getIdTipoDato() != null ? tipologicheById.get(schema.getIdTipoDato()) : null;
        String regexDefault = tip != null && tip.getRegex() != null ? tip.getRegex() : "";
        JsonNode extra = campiExtra != null ? campiExtra.path(schema.getKey()) : null;
        String descrizione = extra != null ? extra.path("descrizione").asText("") : "";
        String regex = extra != null && extra.hasNonNull("regex") ? extra.path("regex").asText(regexDefault) : regexDefault;
        return CampoTicketDTO.builder()
                .id(index)
                .label(nullToEmpty(schema.getLabel()))
                .descrizione(descrizione)
                .campo(tip != null ? tip.getTipoDati() : schema.getKey())
                .tipoValore(nullToEmpty(schema.getInputType()))
                .obbligatoria(schema.getRequired() != null && schema.getRequired() == 1)
                .regex(regex)
                .build();
    }

    private List<ComunicazioneOnboardingDTO> parseComunicazioni(JsonNode processVars) {
        List<ComunicazioneOnboardingDTO> result = new ArrayList<>();
        JsonNode arr = processVars.path(KEY_COMUNICAZIONI);
        if (arr.isArray()) {
            long index = 1;
            for (JsonNode node : arr) {
                result.add(ComunicazioneOnboardingDTO.builder()
                        .id(index++)
                        .canale(node.path("canale").asText(""))
                        .descrizione(node.path("descrizione").asText(""))
                        .obbligatoria(node.path("obbligatoria").asBoolean(true))
                        .build());
            }
        }
        return result;
    }

    private JsonNode readProcessVars(String processVars) {
        if (processVars == null || processVars.isBlank()) {
            return objectMapper.createObjectNode();
        }
        try {
            JsonNode node = objectMapper.readTree(processVars);
            return node != null && node.isObject() ? node : objectMapper.createObjectNode();
        } catch (JsonProcessingException ex) {
            log.warn("PROCESS_VARS non è un JSON valido, ignorato: {}", processVars);
            return objectMapper.createObjectNode();
        }
    }

    // ---------- utils ----------

    private Map<Long, TipologicaCampoDinamico> tipologicheById() {
        return tipologicaRepository.findAll().stream()
                .filter(t -> t.getIdTipoDati() != null)
                .collect(Collectors.toMap(TipologicaCampoDinamico::getIdTipoDati, Function.identity(), (a, b) -> a));
    }

    private String buildNome(boolean ticket, String nomePiattaforma, String processKey) {
        if (ticket) {
            return ("Abilitazione ticket " + nullToEmpty(nomePiattaforma)).trim();
        }
        return ("Processo " + toTitleCase(processKey)).trim();
    }

    private String buildKey(String label, String campo, int progressivo) {
        String base = label != null && !label.isBlank() ? label : nullToEmpty(campo);
        String[] parti = base.trim().toLowerCase().split("[^a-z0-9]+");
        StringBuilder sb = new StringBuilder();
        for (String parte : parti) {
            if (parte.isEmpty()) {
                continue;
            }
            if (sb.length() == 0) {
                sb.append(parte);
            } else {
                sb.append(Character.toUpperCase(parte.charAt(0))).append(parte.substring(1));
            }
        }
        String key = sb.length() == 0 ? "campo" + progressivo : sb.toString();
        return key.length() > 50 ? key.substring(0, 50) : key;
    }

    private String uniqueKey(String base, java.util.Set<String> usati) {
        if (!usati.contains(base)) {
            return base;
        }
        int suffix = 1;
        String candidate;
        do {
            String prefix = base.length() > 46 ? base.substring(0, 46) : base;
            candidate = prefix + suffix;
            suffix++;
        } while (usati.contains(candidate));
        return candidate;
    }

    private String toTitleCase(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        String[] parti = value.trim().toLowerCase().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String parte : parti) {
            if (parte.isEmpty()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(Character.toUpperCase(parte.charAt(0))).append(parte.substring(1));
        }
        return sb.toString();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
