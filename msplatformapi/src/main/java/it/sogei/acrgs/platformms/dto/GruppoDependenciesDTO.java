package it.sogei.acrgs.platformms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GruppoDependenciesDTO {
    private List<Dependency> dependencies;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Dependency {
        private String type;
        private String name;
        private Long id;
    }
}