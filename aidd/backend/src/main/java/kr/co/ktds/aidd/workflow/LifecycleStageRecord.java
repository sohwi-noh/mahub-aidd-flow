package kr.co.ktds.aidd.workflow;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;

@JsonIgnoreProperties(ignoreUnknown = true)
public record LifecycleStageRecord(
    int stage,
    String nameKo,
    String agent,
    String model,
    String reasoning,
    TokenUsageRecord tokenUsage,
    Instant startedAt,
    Instant completedAt,
    String status,
    String artifactPath
) {
}
