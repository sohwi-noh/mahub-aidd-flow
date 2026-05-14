package kr.co.ktds.aidd.health;

import java.time.Instant;
import kr.co.ktds.aidd.db.DbHealth;
import kr.co.ktds.aidd.db.DbHealthProbe;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class HealthController {

    private final DbHealthProbe dbHealthProbe;

    HealthController(DbHealthProbe dbHealthProbe) {
        this.dbHealthProbe = dbHealthProbe;
    }

    @GetMapping("/api/health")
    HealthResponse health() {
        return new HealthResponse("UP", dbHealthProbe.check(), Instant.now());
    }

    record HealthResponse(String status, DbHealth db, Instant checkedAt) {
    }
}
