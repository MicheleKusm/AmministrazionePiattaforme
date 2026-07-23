package it.sogei.acrgs.platformms.dto.projection;

import java.math.BigDecimal;

public interface DependencyProjection {

    String getType();
    String getName();
    BigDecimal getId();
}