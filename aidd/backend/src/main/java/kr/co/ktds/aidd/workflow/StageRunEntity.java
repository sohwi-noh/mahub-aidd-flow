package kr.co.ktds.aidd.workflow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "aidd_stage_run")
class StageRunEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_run_id", nullable = false)
    private Long id;

    @Column(name = "issue_key", length = 64, nullable = false)
    private String issueKey;

    @Column(name = "run_id", length = 80)
    private String runId;

    @Column(name = "stage_number", nullable = false)
    private int stageNumber;

    @Column(name = "stage_name", length = 120, nullable = false)
    private String stageName;

    @Column(name = "agent", length = 120, nullable = false)
    private String agent;

    @Column(name = "model", length = 120)
    private String model;

    @Column(name = "reasoning", length = 120)
    private String reasoning;

    @Column(name = "status", length = 240, nullable = false)
    private String status;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "token_availability", length = 40)
    private String tokenAvailability;

    @Column(name = "reported_total_tokens")
    private Long reportedTotalTokens;

    @Column(name = "estimated_visible_tokens")
    private Long estimatedVisibleTokens;

    @Column(name = "artifact_path", length = 1000)
    private String artifactPath;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected StageRunEntity() {
    }

    StageRunEntity(
        String issueKey,
        String runId,
        int stageNumber,
        String stageName,
        String agent,
        String model,
        String reasoning,
        String status,
        Instant startedAt,
        Instant endedAt,
        String tokenAvailability,
        Long reportedTotalTokens,
        Long estimatedVisibleTokens,
        String artifactPath
    ) {
        this.issueKey = issueKey;
        this.runId = runId;
        this.stageNumber = stageNumber;
        this.stageName = stageName;
        this.agent = agent;
        this.model = model;
        this.reasoning = reasoning;
        this.status = status;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.tokenAvailability = tokenAvailability;
        this.reportedTotalTokens = reportedTotalTokens;
        this.estimatedVisibleTokens = estimatedVisibleTokens;
        this.artifactPath = artifactPath;
    }

    LifecycleStageRecord toRecord() {
        return new LifecycleStageRecord(
            stageNumber,
            stageName,
            agent,
            model,
            reasoning,
            new TokenUsageRecord(reportedTotalTokens, estimatedVisibleTokens, tokenAvailability),
            startedAt,
            endedAt,
            status,
            artifactPath
        );
    }
}
