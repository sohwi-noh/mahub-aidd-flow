package kr.co.ktds.aidd.linear;

import java.time.Instant;

public record LinearSyncResult(
    String projectId,
    String projectName,
    int milestoneCount,
    int issueCount,
    Instant syncedAt
) {
}
