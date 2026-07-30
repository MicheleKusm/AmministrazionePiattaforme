package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "UTILITY_TOOL")
public class UtilityTool {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "UTILITY_TOOL_id_gen")
    @SequenceGenerator(name = "UTILITY_TOOL_id_gen", sequenceName = "SEQ_UTILITY_TOOL", allocationSize = 1)
    @Column(name = "ID", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Column(name = "TYPE", nullable = false, length = 50)
    private String type;

    @Size(max = 100)
    @NotNull
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Size(max = 250)
    @Column(name = "ADDITIONAL_INFO", length = 250)
    private String additionalInfo;
}