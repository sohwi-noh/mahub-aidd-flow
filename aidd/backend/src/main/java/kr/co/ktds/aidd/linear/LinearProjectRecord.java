package kr.co.ktds.aidd.linear;

import java.time.Instant;
import java.util.List;

public record LinearProjectRecord(
    String id,
    String name,
    String activeMilestoneName,
    Instant fetchedAt,
    List<LinearMilestoneRecord> milestones
) {
}
