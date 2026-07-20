package it.sogei.acrgs.platformms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RuoliRefAppartenenzaId implements Serializable {

    @Column(name = "ID_RUOLO")
    private Long idRuolo;

    @Column(name = "ID_GRUPPO_APPARTENENZA")
    private Long idGruppoAppartenenza;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RuoliRefAppartenenzaId that)) {
            return false;
        }
        return Objects.equals(idRuolo, that.idRuolo) && Objects.equals(idGruppoAppartenenza, that.idGruppoAppartenenza);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRuolo, idGruppoAppartenenza);
    }
}
