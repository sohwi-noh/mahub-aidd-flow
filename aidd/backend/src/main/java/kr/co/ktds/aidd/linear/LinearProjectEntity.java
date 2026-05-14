package kr.co.ktds.aidd.linear;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "aidd_linear_project")
class LinearProjectEntity {

    @Id
    @Column(name = "project_id", length = 80, nullable = false)
    private String projectId;

    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Column(name = "active_milestone_name", length = 200, nullable = false)
    private String activeMilestoneName;

    @Column(name = "fetched_at", nullable = false)
    private Instant fetchedAt;

    protected LinearProjectEntity() {
    }

    LinearProjectEntity(String projectId, String name, String activeMilestoneName, Instant fetchedAt) {
        this.projectId = projectId;
        this.name = name;
        this.activeMilestoneName = activeMilestoneName;
        this.fetchedAt = fetchedAt;
    }

    String projectId() {
        return projectId;
    }

    LinearProjectRecord toRecord(List<LinearMilestoneRecord> milestones) {
        return new LinearProjectRecord(projectId, name, activeMilestoneName, fetchedAt, milestones);
    }
}
