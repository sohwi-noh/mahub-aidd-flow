package kr.co.ktds.aidd.linear;

import java.time.LocalDate;

public record LinearMilestoneRecord(
    String id,
    String name,
    String description,
    Double progress,
    Double sortOrder,
    LocalDate targetDate
) {
}
