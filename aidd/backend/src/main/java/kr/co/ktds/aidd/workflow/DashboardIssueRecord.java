package kr.co.ktds.aidd.workflow;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DashboardIssueRecord(
    String issueId,
    String title,
    String linearProject,
    String linearMilestone,
    List<PullRequestRecord> pullRequests,
    List<String> labels,
    String status,
    Integer currentStage,
    String currentStageName,
    int completedStageCount,
    int totalStageCount,
    Instant startedAt,
    Instant completedAt,
    List<LifecycleStageRecord> stages,
    List<ArtifactRecord> artifacts
) {
}
