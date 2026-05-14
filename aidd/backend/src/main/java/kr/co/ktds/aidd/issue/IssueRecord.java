package kr.co.ktds.aidd.issue;

import java.time.Instant;
import java.util.List;

public record IssueRecord(
    String issueKey,
    String issueId,
    String title,
    String status,
    String statusType,
    String source,
    String url,
    Integer priority,
    String projectId,
    String projectName,
    String milestoneId,
    String linearMilestone,
    List<String> labels,
    Instant createdAt,
    Instant updatedAt,
    Instant completedAt
) {
}
