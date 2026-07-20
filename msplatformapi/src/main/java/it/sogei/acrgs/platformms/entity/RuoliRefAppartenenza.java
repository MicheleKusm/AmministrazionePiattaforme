package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "RUOLI_REF_APPARTENENZA")
public class RuoliRefAppartenenza {

    @EmbeddedId
    private RuoliRefAppartenenzaId id;
}
