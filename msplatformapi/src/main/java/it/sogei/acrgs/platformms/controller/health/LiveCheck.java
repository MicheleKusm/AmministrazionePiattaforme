package it.sogei.acrgs.platformms.controller.health;

import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Component;

@Component
@Endpoint(id = "live")
public class LiveCheck {

    @ReadOperation
    public Health call() {
        return Health.up().build();
    }
}
