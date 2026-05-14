package kr.co.ktds.aidd.linear;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "aidd_linear_milestone")
class LinearMilestoneEntity {

    @Id
    @Column(name = "milestone_id", length = 80, nullable = false)
    private String milestoneId;

    @Column(name = "project_id", length = 80, nullable = false)
    private String projectId;

    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "progress")
    private Double progress;

    @Column(name = "sort_order")
    private Double sortOrder;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "fetched_at", nullable = false)
    private Instant fetchedAt;

    protected LinearMilestoneEntity() {
    }

    LinearMilestoneEntity(
        String milestoneId,
        String projectId,
        String name,
        String description,
        Double progress,
        Double sortOrder,
        LocalDate targetDate,
        Instant fetchedAt
    ) {
        this.milestoneId = milestoneId;
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.progress = progress;
        this.sortOrder = sortOrder;
        this.targetDate = targetDate;
        this.fetchedAt = fetchedAt;
    }

    LinearMilestoneRecord toRecord() {
        return new LinearMilestoneRecord(milestoneId, name, description, progress, sortOrder, targetDate);
    }
}
